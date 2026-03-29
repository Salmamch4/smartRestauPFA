import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Article } from '../models/article.model';
import { CreateArticle } from '../models/create-article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'https://localhost:7277/api/articles';

  constructor(private http: HttpClient) {}

  // GET ALL
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  // GET BY ID
  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  createArticle(article: CreateArticle): Observable<any> {
    return this.http.post(this.apiUrl, article);
  }

  // UPDATE
  updateArticle(id: string, article: CreateArticle): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, article);
  }

  // DELETE
  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}