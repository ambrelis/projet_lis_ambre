import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pollution, PollutionService } from '../../services/pollution.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../shared/states/auth-state';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pollution-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution-edit.component.html',
  styleUrl: './pollution-edit.component.css'
})
export class PollutionEdit {
  @Input() pollution: Pollution | null = null;
  selectedFile: File | null = null;
  uploadingPhoto = false;
  photoUrlInput: string = '';

  constructor(
    private pollutionService: PollutionService,
    private http: HttpClient,
    private store: Store
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 5 Mo');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Seules les images sont autorisées');
        return;
      }
      this.selectedFile = file;
    }
  }

  async uploadPhoto(): Promise<string | null> {
    if (!this.selectedFile) return null;
    this.uploadingPhoto = true;
    const formData = new FormData();
    formData.append('photo', this.selectedFile);

    const token = this.store.selectSnapshot(AuthState.getToken);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response: any = await this.http.post(
        `${environment.apiUrl}/api/pollution/upload`,
        formData,
        { headers }
      ).toPromise();
      this.uploadingPhoto = false;
      return response.url;
    } catch (error) {
      this.uploadingPhoto = false;
      alert('Erreur lors de l\'upload de la photo');
      return null;
    }
  }

  async saveChanges() {
    if (!this.pollution) return;

    // Si une nouvelle photo est uploadée, on l'upload d'abord
    if (this.selectedFile) {
      const uploadedUrl = await this.uploadPhoto();
      if (uploadedUrl) {
        this.pollution.photo_url = uploadedUrl;
      }
    }
    // Si une URL est saisie, on la prend en priorité
    if (this.photoUrlInput && this.photoUrlInput.trim() !== '') {
      this.pollution.photo_url = this.photoUrlInput.trim();
    }
  }
}
