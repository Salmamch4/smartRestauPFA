import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// ⚠️ عدل path حسب بلاصتك (هذا هو الغالب الصحيح)
import { ArticleService } from '../../../services/article/article.service';

@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html'
})
export class UpdateArticleComponent implements OnInit {

  id: string = '';

  article: any = {
    libelle: '',
    quantiteEnStock: 0,
    seuilAlerte: 0,
    unite: ''
  };

  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      alert('ID invalide');
      this.router.navigate(['/articles']);
      return;
    }

    this.id = idParam;
    this.loadArticle();
  }

  // 🔄 LOAD
  loadArticle(): void {
    this.loading = true;

    this.articleService.getById(this.id).subscribe({
      next: (data: any) => {
        this.article = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement ❌';
        this.loading = false;
      }
    });
  }

  // ✅ UPDATE
  updateArticle(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.articleService.update(this.id, this.article).subscribe({
      next: () => {
        this.successMessage = 'Article modifié avec succès ✅';

        setTimeout(() => {
          this.router.navigate(['/articles']);
        }, 1000);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Erreur lors de la modification ❌';
      }
    });
  }

  // 🔁 RESET
  resetForm(): void {
    this.loadArticle();
    this.successMessage = '';
    this.errorMessage = '';
  }

  // 🔙 BACK
  goBack(): void {
    this.router.navigate(['/articles']);
  }
}