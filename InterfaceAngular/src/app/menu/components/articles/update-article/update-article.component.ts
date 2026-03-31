import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../services/article/article.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.component.html',
  styleUrls: ['./update-article.component.css']
})
export class UpdateArticleComponent implements OnInit {

  id!: string;

  article: Article = {
    libelle: '',
    quantiteEnStock: 0,
    seuilAlerte: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // ✅ الصحيح
    this.articleService.getById(this.id).subscribe((data: Article) => {
      this.article = data;
    });
  }

  updateArticle(): void {
    this.articleService.update(this.id, this.article).subscribe(() => {
      alert('Article updated!');
      this.router.navigate(['/articles']);
    });
  }
}