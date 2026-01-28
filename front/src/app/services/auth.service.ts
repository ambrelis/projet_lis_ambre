import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  telephone?: string;
  organisation?: string;
  role?: 'citoyen' | 'entreprise' | 'admin';
  adresse?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    telephone?: string;
    organisation?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Connexion utilisateur
   * Le token JWT sera retourné dans la réponse et stocké dans le store
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Inscription utilisateur
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  /**
   * Vérifier le token (sera envoyé automatiquement par l'intercepteur)
   */
  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify`);
  }

  /**
   * Déconnexion
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  /**
   * Vérifier si l'utilisateur est connecté
   * Utilise NGXS state au lieu de localStorage
   */
  isLoggedIn(): boolean {
    // Cette méthode peut être supprimée si vous utilisez uniquement NGXS
    return false; // À implémenter avec NGXS state
  }
}
