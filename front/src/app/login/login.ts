import { Component, inject } from '@angular/core';
import { Login as LoginAction, Logout } from '../../shared/actions/auth-action';
import { Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthState } from '../../shared/states/auth-state';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private store = inject(Store);

  email = '';
  mot_de_passe = '';
  errorMessage = '';
  loading = false;

  connexion = toSignal(this.store.select(AuthState.isConnected), {
    initialValue: false
  });

  login() {
    this.errorMessage = '';

    if (!this.email || !this.mot_de_passe) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;

    this.store.dispatch(new LoginAction({
      email: this.email,
      mot_de_passe: this.mot_de_passe
    })).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
  

