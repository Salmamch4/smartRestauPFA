import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article/article.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  // TABLE DATA
  articles: Article[] = [];

  // UI STATE
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // FILTER
  filterText: string = '';

  // Date de dernière mise à jour
  lastUpdate: Date = new Date();

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  // LOAD
  loadArticles(): void {
    this.loading = true;

    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
        this.loading = false;
        this.lastUpdate = new Date();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement';
        this.loading = false;
      }
    });
  }

  // DELETE
  deleteArticle(id: string | undefined): void {
    if (!id) {
      this.errorMessage = 'ID article invalide';
      return;
    }
    
    if (confirm('Supprimer cet article ?')) {
      this.articleService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Article supprimé avec succès';
          this.errorMessage = '';
          this.loadArticles();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la suppression';
          this.successMessage = '';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  // REFRESH
  refresh(): void {
    this.loadArticles();
  }

  // FILTER
  get filteredArticles(): Article[] {
    if (!this.filterText) return this.articles;
    
    const search = this.filterText.toLowerCase();
    return this.articles.filter(a =>
      a.libelle?.toLowerCase().includes(search)
    );
  }

  // GET STATUS CLASS
  getStatusClass(article: Article): string {
    if (article.quantiteEnStock === 0) return 'bg-danger-subtle text-danger border border-danger';
    if (article.quantiteEnStock <= article.seuilAlerte) return 'bg-warning-subtle text-warning border border-warning';
    return 'bg-success-subtle text-success border border-success';
  }

  // GET STATUS ICON
  getStatusIcon(article: Article): string {
    if (article.quantiteEnStock === 0) return 'bi-x-circle';
    if (article.quantiteEnStock <= article.seuilAlerte) return 'bi-exclamation-triangle';
    return 'bi-check-circle';
  }

  // GET STATUS TEXT
  getStatusText(article: Article): string {
    if (article.quantiteEnStock === 0) return 'Rupture';
    if (article.quantiteEnStock <= article.seuilAlerte) return 'Stock faible';
    return 'Disponible';
  }
}