import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pollution, PollutionService } from '../services/pollution.service';
import { PollutionDetail } from "../pollution-detail/pollution-detail.component";
import { PollutionEdit } from "../components/pollution-edit/pollution-edit.component";
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddFavorite, RemoveFavorite } from '../../shared/actions/favorites-action';
import { FavoritesState } from '../../shared/states/favorites-state';

@Component({
  selector: 'app-pollution-list',
  imports: [CommonModule, PollutionDetail, PollutionEdit, FormsModule],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css'
})
export class PollutionListComponent implements OnInit {
      /** Affiche le formulaire d'ajout de pollution */
      onAjouterPollution() {
        // À adapter selon la logique de navigation ou d'affichage du formulaire
        // Par exemple, navigation ou affichage d'un composant dédié
        window.location.href = '/ajouter-pollution';
        // Ou déclencher un EventEmitter, ou afficher un composant, selon votre architecture
      }
    ngOnInit(): void {
      this.pollutionService.pollutions$.subscribe(data => {
        this.pollutions = data;
        this.applyFilters();
      });
      this.pollutionService.loadPollutions();
    }
  pollutions: Pollution[] = [];
  filteredPollutions: Pollution[] = [];

  pollutionToView: Pollution | null = null;
  pollutionToEdit: Pollution | null = null;

  filter = {
    type: '',
    date: ''
  };

  @Output() voirDetail = new EventEmitter<Pollution>();
  @Output() editPollutionEvent = new EventEmitter<Pollution>();

  constructor(
    private pollutionService: PollutionService,
    private store: Store
  ) {}

  /** Applique les filtres en fonction des champs */
  applyFilters() {
    this.filteredPollutions = this.pollutions.filter(p => {
      const matchType = this.filter.type
        ? p.type_pollution.toLowerCase().includes(this.filter.type.toLowerCase())
        : true;

      const matchDate = this.filter.date
        ? new Date(p.date_observation).toISOString().slice(0, 10) === this.filter.date
        : true;

      return matchType && matchDate;
    });
  }

  /** Réinitialise les filtres */
  clearFilters() {
    this.filter = { type: '', date: '' };
    this.applyFilters();
  }

  /** Quand un champ de filtre change */
  onFilterChange() {
    this.applyFilters();
  }

  viewDetail(p: Pollution) {
    if (this.pollutionToView && this.pollutionToView.id === p.id) {
      this.pollutionToView = null;
    } else {
      this.pollutionToView = p;
      this.pollutionToEdit = null;
    }
  }

  editPollution(p: Pollution) {
    if (this.pollutionToEdit && this.pollutionToEdit.id === p.id) {
      this.pollutionToEdit = null;
    } else {
      this.pollutionToEdit = { ...p };
      this.pollutionToView = null;
    }
  }

  closeDetail() {
    this.pollutionToView = null;
  }

  closeEdit() {
    this.pollutionToEdit = null;
  }

  deletePollution(id?: number): void {
    if (!id) return;
    this.pollutionService.deletePollution(id!).subscribe({
      next: () => {
        if (this.pollutionToView?.id === id) this.pollutionToView = null;
        if (this.pollutionToEdit?.id === id) this.pollutionToEdit = null;
      },
      error: (err) => console.error('Erreur suppression :', err)
    });
  }

  toggleFav(id: number) {
    const isFav = this.store.selectSnapshot(FavoritesState.isFavorite)(id);
    if (isFav) {
      this.store.dispatch(new RemoveFavorite(id));
    } else {
      this.store.dispatch(new AddFavorite(id));
    }
  }

  isFavorite(id: number): boolean {
    return this.store.selectSnapshot(FavoritesState.isFavorite)(id);
  }

}
