import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PollutionAddComponent } from '../components/pollution-add/pollution-add.component';
import { PollutionEdit } from '../components/pollution-edit/pollution-edit.component';
import { UserAddComponent } from '../components/users/user-add/user-add.component';
import { UserListComponent } from '../components/users/user-list/user-list.component';
import { PollutionDetail } from '../pollution-detail/pollution-detail.component';
import { PollutionListComponent } from '../pollution-list/pollution-list.component';
import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { Pollution, PollutionService } from '../services/pollution.service';
import { Store } from '@ngxs/store';
import { AuthState } from '../../shared/states/auth-state';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule,FormsModule, ReactiveFormsModule, PollutionRecap, PollutionDetail, PollutionEdit, CommonModule, PollutionAddComponent, PollutionListComponent, UserAddComponent, UserListComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  afficherFormulaire = false;
  formValide = false;
  donneesRecapitulatif: any;

  afficherFormUser = false;

 // Ajout pour Edit / Detail
  pollutionToEdit: Pollution | null = null;
  pollutionToView: Pollution | null = null;
  constructor(private pollutionService: PollutionService, private store: Store) {}
    isAdmin(): boolean {
      const user = this.store.selectSnapshot(AuthState.getUser);
      return user?.role === 'admin';
    }
  toggleFormulaire() {
    this.afficherFormulaire = !this.afficherFormulaire;
  }

  toggleFormUser() {
    this.afficherFormUser = !this.afficherFormUser;
  }

  showDetail(pollution: Pollution) {
    this.pollutionToView = pollution;
    this.pollutionToEdit = null;
  }

   ajouterPollution(data: Pollution) {
   
  }

  editPollution(pollution: Pollution) {
    this.pollutionToEdit = pollution;
    this.pollutionToView = null;
  }

  resetForm() {
  this.formValide = false;
  this.donneesRecapitulatif = null;
  this.afficherFormulaire = false;
  }

}

