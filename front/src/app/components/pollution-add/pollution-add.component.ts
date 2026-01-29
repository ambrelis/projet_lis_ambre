 import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollutionDeclaration } from '../../pollution-declaration/pollution-declaration';
import { PollutionService, Pollution } from '../../services/pollution.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../shared/states/auth-state';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pollution-add',
  imports: [CommonModule, FormsModule, PollutionDeclaration],
  templateUrl: './pollution-add.component.html',
  styleUrl: './pollution-add.component.css'
})

export class PollutionAddComponent {
  selectedFile: File | null = null;
  uploadingPhoto = false;

  constructor(
    private pollutionService: PollutionService,
    private http: HttpClient,
    private store: Store
  ) {}

  async ajouterPollution(pollution: Pollution & { selectedFile?: File }) {
    // Si un fichier est sélectionné, on l'upload et on récupère l'URL
    if (pollution.selectedFile) {
      this.uploadingPhoto = true;
      const formData = new FormData();
      formData.append('photo', pollution.selectedFile);

      const token = this.store.selectSnapshot(AuthState.getToken);
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      try {
        const response: any = await this.http.post(
          `${environment.apiUrl}/pollution/upload`,
          formData,
          { headers }
        ).toPromise();
        this.uploadingPhoto = false;
        if (response && response.url) {
          pollution.photo_url = response.url; // On met l'URL obtenue dans photo_url
        } else {
          pollution.photo_url = '';
        }
      } catch (error) {
        this.uploadingPhoto = false;
        alert('Erreur lors de l\'upload de la photo');
        return;
      }
    }

    const { selectedFile, ...pollutionToSend } = pollution;

  }
}