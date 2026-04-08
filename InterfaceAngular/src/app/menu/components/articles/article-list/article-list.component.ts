import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article/article.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {

  // ✅ TABLE DATA
  articles: Article[] = [];

  // ✅ UI STATE
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // ✅ FILTER
  filterText: string = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  // 🔹 LOAD
  loadArticles(): void {
    this.loading = true;

    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement ❌';
        this.loading = false;
      }
    });
  }

  // 🔹 DELETE
  deleteArticle(id: string): void {
    if (confirm('Supprimer cet article ?')) {
      this.articleService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Supprimé avec succès ✅';
          this.errorMessage = '';
          this.loadArticles();
        },
        error: () => {
          this.errorMessage = 'Erreur suppression ❌';
          this.successMessage = '';
        }
      });
    }
  }

  // 🔹 FILTER
  get filteredArticles() {
    if (!this.filterText) return this.articles;

    return this.articles.filter(a =>
      a.libelle.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
}