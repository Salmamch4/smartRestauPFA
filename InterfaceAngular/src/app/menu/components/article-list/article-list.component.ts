import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {

  articles: Article[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe({
      next: data => this.articles = data,
      error: err => console.error(err)
    });
  }

  deleteArticle(id: string): void {
    if(confirm('Are you sure?')) {
      this.articleService.deleteArticle(id).subscribe(() => {
        this.loadArticles();
      });
    }
  }
}