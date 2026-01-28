import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { FavoritesState } from '../../shared/states/favorites-state';
import { AuthState } from '../../shared/states/auth-state';
import { Logout } from '../../shared/actions/auth-action';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  private store = inject(Store);
  favoritesCount = 0;

  isConnected = toSignal(this.store.select(AuthState.isConnected), {
    initialValue: false
  });

  user = toSignal(this.store.select(AuthState.getUser), {
    initialValue: null
  });

  ngOnInit(): void {
    this.store.select(FavoritesState.getFavoritesCount).subscribe(count => {
      this.favoritesCount = count;
    });
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
