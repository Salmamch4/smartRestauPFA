import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.css']
})
export class UpdateArticleComponent implements OnInit {

  id!: string;

  article: Article = {
    id: '',
    libelle: '',
    quantiteEnStock: 0,
    seuilAlerte: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.articleService.getArticleById(this.id).subscribe(data => {
      this.article = data;
    });
  }

  updateArticle(): void {
    this.articleService.updateArticle(this.id, this.article).subscribe(() => {
      this.router.navigate(['/articles']);
    });
  }
}