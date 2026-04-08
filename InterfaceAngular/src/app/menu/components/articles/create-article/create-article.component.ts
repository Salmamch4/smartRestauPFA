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

    console.log("DATA SENT 👉", this.article); // مهم debug

    this.articleService.create(this.article).subscribe({
      next: (res) => {
        console.log("SUCCESS ✅", res);

        this.successMessage = 'Article créé avec succès ✅';
        this.errorMessage = '';

        this.resetForm();

        setTimeout(() => {
          this.router.navigate(['/articles']);
        }, 1000);
      },

      error: (err) => {
        console.error("ERROR ❌", err);

        this.errorMessage = 'Erreur création ❌';
        this.successMessage = '';
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
  }
}