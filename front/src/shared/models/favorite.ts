export interface Favorite {
  id: number;
  user_id: number;
  pollution_id: number;
  added_at: Date;
  pollution?: any;
}
