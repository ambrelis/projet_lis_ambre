import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { FavoritesState } from '../../shared/states/favorites-state';
import { RemoveFavorite, AddFavorite, ClearFavorites } from '../../shared/actions/favorites-action';
import { Observable, map } from 'rxjs';
import { Pollution } from '../services/pollution.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css']
})
export class FavoritesPageComponent implements OnInit {
  favoritePollutions$!: Observable<Pollution[]>;
  favoritesCount$!: Observable<number>;

  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {
    // Les favoris de l'API contiennent déjà les pollutions incluses
    this.favoritePollutions$ = this.store.select(FavoritesState.getFavorites).pipe(
      map(favorites => favorites.map(f => f.pollution).filter(p => p != null))
    );

    this.favoritesCount$ = this.store.select(FavoritesState.getFavoritesCount);
  }

  toggleFav(id: number): void {
    const isFav = this.store.selectSnapshot(FavoritesState.isFavorite)(id);
    if (isFav) {
      this.store.dispatch(new RemoveFavorite(id));
    } else {
      this.store.dispatch(new AddFavorite(id));
    }
  }

  clearAllFavorites(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      this.store.dispatch(new ClearFavorites());
    }
  }

  isFavorite(id: number): boolean {
    return this.store.selectSnapshot(FavoritesState.isFavorite)(id);
  }
}
