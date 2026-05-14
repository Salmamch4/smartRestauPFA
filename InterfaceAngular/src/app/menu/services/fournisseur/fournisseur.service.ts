import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = 'http://localhost:5000/api/fournisseur';

  constructor(private http: HttpClient) { }

  // Ajouter les headers HTTP
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getByICE(ice: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-ice/${ice}`, { headers: this.getHeaders() });
  }

  add(fournisseur: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, fournisseur, { headers: this.getHeaders() });
  }

  update(id: string, fournisseur: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, fournisseur, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}