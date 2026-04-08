import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Article } from '../../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://localhost:5160/api/articles';

  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  create(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  update(id: string, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article)
      .pipe(catchError(this.handleError));
  }

  // DELETE
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ERROR HANDLING 🔥
  private handleError(error: HttpErrorResponse) {
    console.error('API ERROR 👉', error);
    return throwError(() => error);
  }
}