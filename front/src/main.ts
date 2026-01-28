import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AuthState } from './shared/states/auth-state';
import { FavoritesState } from './shared/states/favorites-state';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, FavoritesState], {
        developmentMode: !environment.production
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ['auth'] // ✅ Persiste 'auth' en localStorage (connexion, user, token=null après refresh)
      })
    ),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
