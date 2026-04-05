import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategorieService } from '../../../services/categorie/categorie.service';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.css']
})
export class AddCategorieComponent {
  libelle: string = '';
  description: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private categorieService: CategorieService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.libelle.trim()) {
      this.errorMessage = 'Le libellé est obligatoire';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const data = {
      libelle: this.libelle,
      description: this.description
    };

    this.categorieService.add(data).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = '✅ Catégorie ajoutée avec succès!';
        this.resetForm();
        setTimeout(() => {
          this.router.navigate(['/list-categories']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || '❌ Erreur lors de l\'ajout';
      }
    });
  }

  resetForm(): void {
    this.libelle = '';
    this.description = '';
    this.errorMessage = '';
  }
}