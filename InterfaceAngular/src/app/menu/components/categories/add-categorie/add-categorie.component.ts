import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategorieService } from '../../../services/categorie/categorie.service';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.css']
})
export class AddCategorieComponent implements OnInit {
  libelle: string = '';
  description: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  categorieId: string = '';

  constructor(
    private categorieService: CategorieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categorieId = id;
      this.loadCategorie(id);
    }
  }

  loadCategorie(id: string): void {
    this.categorieService.getById(id).subscribe({
      next: (cat) => {
        this.libelle = cat.libelle;
        this.description = cat.description || '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
      }
    });
  }

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

    if (this.isEditMode) {
      this.categorieService.update(this.categorieId, data).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = '✅ Catégorie modifiée avec succès!';
          setTimeout(() => {
            this.router.navigate(['/list-categories']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || '❌ Erreur lors de la modification';
        }
      });
    } else {
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
  }

  resetForm(): void {
    this.libelle = '';
    this.description = '';
    this.errorMessage = '';
  }
}