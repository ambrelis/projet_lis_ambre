import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './favorites-page/favorites-page';
import { HomePage } from './home-page/home-page';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes publiques
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Routes protégées
  { 
    path: 'pollutions', 
    component: HomePage,
    canActivate: [authGuard]
  },

  { 
    path: 'favoris', 
    component: FavoritesPageComponent,
    canActivate: [authGuard]
  },
];
