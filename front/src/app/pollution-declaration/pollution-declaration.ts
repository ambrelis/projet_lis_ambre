  // ...existing code...
// ...imports déplacés plus bas pour éviter la double déclaration...
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pollution } from '../services/pollution.service';
import { UserService } from '../services/user.service';
import { User } from '../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store } from '@ngxs/store';
import { AuthState } from '../../shared/states/auth-state';

@Component({
  selector: 'app-pollution-declaration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-declaration.html',
  styleUrls: ['./pollution-declaration.css']
})
export class PollutionDeclaration {

  formGroup = new FormGroup({
    titre: new FormControl('', Validators.required),
    type_pollution: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    date_observation: new FormControl('', Validators.required),
    lieu: new FormControl('', Validators.required),
    latitude: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-+]?\d+(\.\d+)?$/),
      latitudeValidator
    ]),
    longitude: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-+]?\d+(\.\d+)?$/),
      longitudeValidator
    ]),
    photo_url: new FormControl(''),
  });

  @Output() formValide = new EventEmitter<Pollution>();
  users: User[] = [];
  selectedFile: File | null = null;
  uploadingPhoto = false;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private store: Store
  ) {}
  
  ngOnInit() {
    // Charge et récupère la liste des utilisateurs
    this.userService.loadUsers();
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
  }
  
  isInvalidAndTouchedOrDirty(formControl: FormControl) {
    return formControl.invalid && (formControl.touched || formControl.dirty);
  }

  selectedUser = new FormControl('', Validators.required);

  // Gestion de la sélection de fichier
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Validation de la taille (5MB max)
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 5MB');
        this.selectedFile = null;
        input.value = '';
        return;
      }
      // Validation du type
      if (!this.selectedFile.type.startsWith('image/')) {
        alert('Seules les images sont autorisées');
        this.selectedFile = null;
        input.value = '';
      }
    }
  }

  // Permet de retirer le fichier sélectionné
  removeSelectedFile() {
    this.selectedFile = null;
    // Réinitialise l'input file si besoin (optionnel)
    const input = document.getElementById('photoFile') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  // Upload de la photo vers Cloudinary
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
      console.error('Erreur upload photo:', error);
      this.uploadingPhoto = false;
      alert('Erreur lors de l\'upload de la photo');
      return null;
    }
  }

  async onSubmit() {
    if (this.formGroup.valid && this.selectedUser.value) {
      // On ne fait plus l'upload ici, mais on transmet le fichier sélectionné
      let photoUrl = this.formGroup.value.photo_url || '';

      const pollutionData: Pollution & { selectedFile?: File } = {
        titre: this.formGroup.value.titre!,
        type_pollution: this.formGroup.value.type_pollution || '',
        description: this.formGroup.value.description || '',
        date_observation: this.formGroup.value.date_observation || '',
        lieu: this.formGroup.value.lieu || '',
        latitude: Number(this.formGroup.value.latitude),
        longitude: Number(this.formGroup.value.longitude),
        photo_url: photoUrl,
        user_id: Number(this.selectedUser.value),
        ...(this.selectedFile ? { selectedFile: this.selectedFile } : {})
      };
      this.formValide.emit(pollutionData);
    } else {
      this.formGroup.markAllAsTouched();
      this.selectedUser.markAsTouched();
    }
  }
}

function latitudeValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  if (isNaN(value) || value < -90 || value > 90) {
    return { latitudeInvalid: true };
  }
  return null;
}

function longitudeValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  if (isNaN(value) || value < -180 || value > 180) {
    return { longitudeInvalid: true };
  }
  return null;
}
