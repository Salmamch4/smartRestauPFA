import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article/article.service';
import { Article } from '../../../models/article.model';

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
  this.articleService.getAll().subscribe({
    next: (data: Article[]) => this.articles = data,
    error: (err: any) => console.error(err)
  });
}

  deleteArticle(id: string): void {
    if(confirm('Are you sure?')) {
      this.articleService.delete(id).subscribe(() => {
        this.loadArticles();
      });
    }
  }
}