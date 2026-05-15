// src/app/catalogue/catalogue/produit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:5000/api/ProduitsCategorie';

  constructor(private http: HttpClient) {}

  getByCategorie(categorieId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }
}