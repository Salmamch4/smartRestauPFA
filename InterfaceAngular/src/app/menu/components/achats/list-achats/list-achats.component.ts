import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AchatService } from '../../../services/achat/achat.service';
import { AchatResponse } from '../../../models/achat.model';

@Component({
  selector: 'app-list-achats',
  templateUrl: './list-achats.component.html',
  styleUrls: ['./list-achats.component.css']
})
export class ListAchatsComponent implements OnInit {
  achats: AchatResponse[] = [];
  loading = false;
  errorMessage = '';
  filterText = '';

  constructor(
    private achatService: AchatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAchats();
  }

  loadAchats(): void {
    this.loading = true;
    this.achatService.getAll().subscribe({
      next: (data) => {
        this.achats = data;
        this.loading = false;
        console.log('Achats chargés:', this.achats);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des achats';
        this.loading = false;
      }
    });
  }

  get filteredAchats(): AchatResponse[] {
    if (!this.filterText) return this.achats;
    const search = this.filterText.toLowerCase();
    return this.achats.filter(a => 
      (a.articleLibelle?.toLowerCase().includes(search) || false) ||
      (a.fournisseurRaisonSocial?.toLowerCase().includes(search) || false)
    );
  }

  deleteAchat(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet achat ?')) {
      this.achatService.delete(id).subscribe({
        next: () => {
          this.achats = this.achats.filter(a => a.id !== id);
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }

  updateQuantiteRestante(id: string, currentQuantite: number): void {
    const nouvelleQuantite = prompt('Nouvelle quantité restante:', currentQuantite.toString());
    if (nouvelleQuantite && !isNaN(Number(nouvelleQuantite))) {
      const quantite = Number(nouvelleQuantite);
      const achat = this.achats.find(a => a.id === id);
      
      if (achat && quantite > achat.quantiteAchat) {
        this.errorMessage = `La quantité restante (${quantite}) ne peut pas dépasser la quantité achetée (${achat.quantiteAchat})`;
        return;
      }
      
      if (quantite < 0) {
        this.errorMessage = 'La quantité restante ne peut pas être négative';
        return;
      }
      
      this.achatService.updateQuantiteRestante(id, {
        id: id,
        nouvelleQuantiteRestante: quantite
      }).subscribe({
        next: () => {
          this.loadAchats();
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = err.message || 'Erreur lors de la mise à jour';
        }
      });
    }
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'Épuisé': return 'badge bg-danger';
      case 'Stock faible': return 'badge bg-warning text-dark';
      default: return 'badge bg-success';
    }
  }

  getStatutText(quantiteRestante: number, quantiteAchat: number): string {
    if (quantiteRestante === 0) return 'Épuisé';
    if (quantiteRestante < quantiteAchat * 0.2) return 'Stock faible';
    return 'Disponible';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}