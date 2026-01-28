import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { FavoritesState } from '../../shared/states/favorites-state';
import { RemoveFavorite, ClearFavorites } from '../../shared/actions/favorites-action';
import { PollutionService, Pollution } from '../services/pollution.service';

@Component({
  selector: 'app-pollution-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-favorites.component.html',
  styleUrl: './pollution-favorites.component.css'
})
export class PollutionFavoritesComponent implements OnInit {
  favoritePollutions$!: Observable<Pollution[]>;
  favoritesCount$!: Observable<number>;

  constructor(
    private store: Store,
    private pollutionService: PollutionService
  ) {}

  ngOnInit() {
    const favoriteIds$ = this.store.select(FavoritesState.getFavoriteIds);
    const allPollutions$ = this.pollutionService.getPollutions();

    this.favoritePollutions$ = combineLatest([favoriteIds$, allPollutions$]).pipe(
      map(([ids, pollutions]) => {
        const favIds = Array.isArray(ids) ? ids : [];
        return pollutions.filter(p => p.id && favIds.includes(p.id));
      })
    );

    this.favoritesCount$ = this.store.select(FavoritesState.getFavoritesCount);
  }

  removeFavorite(pollutionId: number) {
    this.store.dispatch(new RemoveFavorite(pollutionId));
  }

  clearAllFavorites() {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      this.store.dispatch(new ClearFavorites());
    }
  }
}
