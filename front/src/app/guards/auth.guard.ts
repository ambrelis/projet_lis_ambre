import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../shared/states/auth-state';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  
  const isLoggedIn = store.selectSnapshot(AuthState.isConnected);
  
  if (isLoggedIn) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
