import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../../../services/categorie/categorie.service';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.css']
})
export class ListCategorieComponent implements OnInit {
  categories: any[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  filterText = '';           // ✅ AJOUTÉ
  lastUpdate: Date = new Date();  // ✅ AJOUTÉ

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categorieService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        this.lastUpdate = new Date();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  // ✅ AJOUTÉ - Filtrage des catégories
  get filteredCategories(): any[] {
    if (!this.filterText) return this.categories;
    const search = this.filterText.toLowerCase();
    return this.categories.filter(cat => 
      cat.libelle?.toLowerCase().includes(search) ||
      cat.description?.toLowerCase().includes(search)
    );
  }

  delete(id: string): void {
    if (confirm('Supprimer cette catégorie ?')) {
      this.categorieService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Catégorie supprimée avec succès';
          this.loadCategories();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la suppression';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  // ✅ AJOUTÉ - Rafraîchir la liste
  refresh(): void {
    this.loadCategories();
  }
}