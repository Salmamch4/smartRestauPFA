import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../../services/article/article.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent {

  successMessage = '';
  errorMessage = '';
  loading = false;  // ✅ AJOUTER CETTE PROPRIÉTÉ

  article: Article = {
    libelle: '',
    quantiteEnStock: 0,
    seuilAlerte: 0,
    unite: ''
  };

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  createArticle(): void {
    if (!this.article.libelle) {
      this.errorMessage = 'Veuillez saisir le libellé de l\'article';
      return;
    }

    console.log("DATA SENT 👉", this.article);
    
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.articleService.create(this.article).subscribe({
      next: (res) => {
        console.log("SUCCESS ✅", res);
        this.loading = false;
        this.successMessage = 'Article créé avec succès ✅';
        this.errorMessage = '';

        this.resetForm();

        setTimeout(() => {
          this.router.navigate(['/articles']);
        }, 2000);
      },

      error: (err) => {
        console.error("ERROR ❌", err);
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création ❌';
        this.successMessage = '';

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  resetForm(): void {
    this.article = {
      libelle: '',
      quantiteEnStock: 0,
      seuilAlerte: 0,
      unite: ''
    };
    this.errorMessage = '';
  }
}