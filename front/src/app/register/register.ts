import { Component, inject } from '@angular/core';
import { Register as RegisterAction } from '../../shared/actions/auth-action';
import { Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthState } from '../../shared/states/auth-state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private store = inject(Store);
  private router = inject(Router);

  nom = '';
  prenom = '';
  email = '';
  mot_de_passe = '';
  confirmPassword = '';
  role: 'citoyen' | 'entreprise' | 'admin' = 'citoyen';
  
  errorMessage = '';
  loading = false;

  onSubmit() {
    this.errorMessage = '';

    // Validation
    if (!this.nom || !this.prenom || !this.email || !this.mot_de_passe) {
      this.errorMessage = 'Tous les champs sont requis';
      return;
    }

    if (this.mot_de_passe !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.mot_de_passe.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    
    this.store.dispatch(new RegisterAction({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      mot_de_passe: this.mot_de_passe,
      role: this.role
    })).subscribe({
      next: () => {
        const isLoggedIn = this.store.selectSnapshot(AuthState.isConnected);
        if (isLoggedIn) {
          this.router.navigate(['/pollutions']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors de l\'inscription';
        this.loading = false;
      }
    });
  }
}
