import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../../../services/categorie/categorie.service';
import { Categorie } from '../../../models/categorie.model';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.css']
})
export class ListCategorieComponent implements OnInit {
  categories: Categorie[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

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
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  delete(id: string): void {
    if (confirm('Supprimer cette catégorie ?')) {
      this.categorieService.delete(id).subscribe({
        next: () => {
          this.successMessage = '✅ Catégorie supprimée!';
          this.loadCategories();
          setTimeout(() => this.successMessage = '', 2000);
        },
        error: () => {
          this.errorMessage = '❌ Erreur lors de la suppression';
        }
      });
    }
  }
}