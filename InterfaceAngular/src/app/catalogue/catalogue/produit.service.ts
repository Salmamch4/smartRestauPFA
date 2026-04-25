import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../catalogue/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'https://localhost:7277/api/produits';

  constructor(private http: HttpClient) {}

  getByCategorie(categorieId: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }
}