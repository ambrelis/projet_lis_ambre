export class LoadFavorites {
  static readonly type = '[Favorites] Load';
}

export class AddFavorite {
  static readonly type = '[Favorites] Add';
  constructor(public pollutionId: number) {}
}

export class RemoveFavorite {
  static readonly type = '[Favorites] Remove';
  constructor(public pollutionId: number) {}
}

export class ClearFavorites {
  static readonly type = '[Favorites] Clear';
}
