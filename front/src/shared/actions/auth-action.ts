import { Auth } from '../models/auth';

export class AuthConnexion {
  static readonly type = '[Auth] Connexion';
  constructor(public payload: Auth) {}
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; mot_de_passe: string }) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: { user: any; token?: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public payload: any) {}
}

export class InitFromStorage {
  static readonly type = '[Auth] Init From Storage';
}
