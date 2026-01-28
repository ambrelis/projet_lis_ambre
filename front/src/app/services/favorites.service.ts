import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FavoriteResponse {
  id: number;
  user_id: number;
  pollution_id: number;
  added_at: Date;
  pollution?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/api/favorites`;

  constructor(private http: HttpClient) {}

  getUserFavorites(): Observable<FavoriteResponse[]> {
    return this.http.get<FavoriteResponse[]>(this.apiUrl);
  }

  addFavorite(pollutionId: number): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(this.apiUrl, { pollution_id: pollutionId });
  }

  removeFavorite(pollutionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${pollutionId}`);
  }

  clearFavorites(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}
