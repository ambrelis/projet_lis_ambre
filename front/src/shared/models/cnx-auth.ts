import { Auth } from './auth';

export class CnxAuth implements Auth {
  connexion: boolean;

  constructor(connexion: boolean) {
    this.connexion = connexion;
  }
}
