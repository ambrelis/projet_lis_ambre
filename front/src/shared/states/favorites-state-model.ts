import { FavoriteResponse } from '../../app/services/favorites.service';

export interface FavoritesStateModel {
  favorites: FavoriteResponse[];
  loaded: boolean;
}
