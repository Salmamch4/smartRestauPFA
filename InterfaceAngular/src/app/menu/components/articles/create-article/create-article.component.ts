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

  article: Article = {
    libelle: '',
    quantiteEnStock: 0,
    seuilAlerte: 0
  };

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  createArticle(): void {
    console.log(this.article);

    this.articleService.create(this.article).subscribe({
      next: () => {
        alert('Article created!');
        this.router.navigate(['/articles']);
      },
      error: (err) => {
        console.error('ERROR:', err);
      }
    });
  }
}