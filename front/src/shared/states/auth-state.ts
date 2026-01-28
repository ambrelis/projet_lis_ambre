import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, InitState, UpdateState } from '@ngxs/store';
import { AuthConnexion, Login, LoginSuccess, Logout, Register, InitFromStorage } from '../actions/auth-action';
import { LoadFavorites, ClearFavorites } from '../actions/favorites-action';
import { AuthStateModel } from './auth-state-model';
import { AuthService } from '../../app/services/auth.service';
import { tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    connexion: false,
    user: null,
    token: null
  },
})
@Injectable()
export class AuthState {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Selector()
  static isConnected(state: AuthStateModel) {
    return state.connexion;
  }

  @Selector()
  static getUser(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static getToken(state: AuthStateModel) {
    return state.token;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap((response) => {        
        ctx.dispatch(new LoginSuccess({
          user: response.user,
          token: response.token
        }));
        
        this.router.navigate(['/pollutions']);
      }),
      catchError((error) => {
        console.error('❌ Erreur login:', error);
        throw error;
      })
    );
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {    
    // Token stocké EN MÉMOIRE uniquement (disparaît au refresh)
    // Cookies HttpOnly côté backend pour persistance de session
    ctx.patchState({
      connexion: true,
      user: action.payload.user,
      token: action.payload.token || null
    });

    //  Charger les favoris après connexion réussie
    ctx.dispatch(new LoadFavorites());
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        
        ctx.patchState({
          connexion: false,
          user: null,
          token: null
        });

        //  Vider les favoris après déconnexion
        ctx.dispatch(new ClearFavorites());
        
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.warn('⚠️ Erreur lors de la déconnexion:', error);
        
        // Même en cas d'erreur, nettoyer le state
        ctx.patchState({
          connexion: false,
          user: null,
          token: null
        });
        
        this.router.navigate(['/login']);
        throw error;
      })
    );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    return this.authService.register(action.payload).pipe(
      tap((response) => {        
        ctx.dispatch(new LoginSuccess({
          user: response.user,
          token: response.token
        }));
        
        this.router.navigate(['/pollutions']);
      }),
      catchError((error) => {
        console.error('❌ Erreur inscription:', error);
        throw error;
      })
    );
  }

  @Action(AuthConnexion)
  connexion(
    { patchState }: StateContext<AuthStateModel>,
    { payload }: AuthConnexion
  ) {
    patchState({
      connexion: payload.connexion,
    });
  }


  @Action(UpdateState)
  updateState(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();
    // Si on a un user mais pas de token (après refresh), c'est normal
    // Le token reste null, les cookies HttpOnly gèrent la session
    if (state.user && state.token) {
      ctx.patchState({
        token: null 
      });
    }
  }
}
