import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject,tap } from 'rxjs';

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  telephone?: string;
  organisation?: string;
  role?: 'citoyen' | 'entreprise' | 'admin';
  adresse?: string;
}


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: data => this.usersSubject.next(data),
      error: err => console.error('Erreur chargement utilisateurs', err)
    });
  }

  // ➕ Créer un utilisateur
  createUser(user: User): Observable<User> {
  return this.http.post<User>(this.apiUrl, user, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(tap(() => this.loadUsers()));
}


  // 📋 Lister les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
