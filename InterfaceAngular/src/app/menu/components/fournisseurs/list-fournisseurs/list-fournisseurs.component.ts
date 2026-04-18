import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../../../services/fournisseur/fournisseur.service';

@Component({
  selector: 'app-list-fournisseurs',
  templateUrl: './list-fournisseurs.component.html',
  styleUrls: ['./list-fournisseurs.component.css']
})
export class ListFournisseursComponent implements OnInit {
  fournisseurs: any[] = [];
  filteredFournisseurs: any[] = [];
  searchTerm: string = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.loading = true;
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        console.log('Données brutes de l\'API:', JSON.stringify(data, null, 2));
        
        // Mapper les données pour s'assurer que les propriétés sont correctes
        this.fournisseurs = data.map((item: any) => ({
          id: item.id,
          raisonSocial: item.raisonSocial || item.raison_social || item.RaisonSocial,
          telephone: item.telephone || item.Telephone,
          ice: item.ice || item.ICE,
          adresse: item.adresse || item.Adresse,
          dateCreation: item.dateCreation || item.date_creation || item.DateCreation
        }));
        
        this.filteredFournisseurs = [...this.fournisseurs];
        console.log('Données formatées:', this.fournisseurs);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
        this.loading = false;
      }
    });
  }

  searchFournisseurs(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFournisseurs = [...this.fournisseurs];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredFournisseurs = this.fournisseurs.filter(fr => {
      return (
        (fr.raisonSocial && fr.raisonSocial.toLowerCase().includes(term)) ||
        (fr.ice && fr.ice.toLowerCase().includes(term)) ||
        (fr.telephone && fr.telephone.toLowerCase().includes(term)) ||
        (fr.adresse && fr.adresse.toLowerCase().includes(term))
      );
    });
    
    console.log('Résultats recherche:', this.filteredFournisseurs.length);
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredFournisseurs = [...this.fournisseurs];
  }

  delete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      this.fournisseurService.delete(id).subscribe({
        next: (deleted) => {
          if (deleted) {
            this.successMessage = 'Fournisseur supprimé avec succès!';
            this.loadFournisseurs();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Erreur lors de la suppression';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }
}