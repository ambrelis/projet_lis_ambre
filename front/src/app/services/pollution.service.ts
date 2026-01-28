import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Pollution {
  id?: number;
  titre: string;
  lieu?: string;
  date_observation: string;
  type_pollution: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  user_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PollutionService {
  private apiUrl =  `${environment.apiUrl}/api/pollution`;

  private pollutionsSubject = new BehaviorSubject<Pollution[]>([]);
  pollutions$ = this.pollutionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadPollutions(): void {
    this.http.get<Pollution[]>(`${this.apiUrl}`)
      .subscribe(data => this.pollutionsSubject.next(data));
  }

  // Ajouter une pollution
  addPollution(pollution: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(`${this.apiUrl}`, pollution).pipe(tap(() => this.loadPollutions()));
  }

  // Récupérer toutes les pollutions
  getPollutions(): Observable<Pollution[]> {
  return this.http.get<Pollution[]>(`${this.apiUrl}`);
}

// Mettre à jour une pollution
  updatePollution(id: number, pollution: Pollution): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/${id}`, pollution)
      .pipe(tap(() => this.loadPollutions()));
  }

  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/${id}`);
  }

  // Supprimer une pollution
  deletePollution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadPollutions()));
  }

}
