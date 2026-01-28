import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-add',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  user: User = { 
    nom: '',
    prenom:'',
    email: '' ,
    mot_de_passe:'', 
    telephone:'',
    organisation:'',
    role: 'citoyen',
    adresse:'',

  };
  message = '';

  constructor(private userService: UserService) {}

  addUser() {
    if (!this.user.nom || !this.user.prenom || !this.user.email || !this.user.mot_de_passe) {
  this.message = 'Veuillez remplir tous les champs obligatoires.';
  return;
  }

    this.userService.createUser(this.user).subscribe({
      next: data => {
        this.message = `Utilisateur ${data.nom} ajouté avec succès !`;
        this.user = { nom: '', prenom:'', email: '' , mot_de_passe:'', telephone:'', organisation:'', role: 'citoyen', adresse:'' }; 
      },
      error: err => {
        console.error('Erreur ajout utilisateur', err);
        this.message = 'Erreur lors de l’ajout de l’utilisateur';
      }
    });
  }
}
