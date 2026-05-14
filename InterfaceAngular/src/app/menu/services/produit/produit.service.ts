import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produit } from '../../models/produit.model';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private apiUrl = 'http://localhost:5000/api/produits'; 

  constructor(private http: HttpClient) {}

  /** Récupérer tous les produits et convertir le champ accentué de l'API */
  getAll(): Observable<Produit[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(produits => produits.map(p => ({
        ...p,
        // Sécurité : on crée 'ingredients' à partir de 'ingrédients' ou on met une liste vide
        ingredients: p.ingrédients || p.ingredients || []
      })))
    );
  }

  /** Récupérer un produit par ID avec la même logique de conversion */
  getById(id: string): Observable<Produit> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => ({
        ...p,
        ingredients: p.ingrédients || p.ingredients || []
      }))
    );
  }

  /** Ajouter un produit (FormData pour l'image) */
  add(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  /** Modifier un produit (FormData pour l'image) */
  update(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  /** Supprimer un produit */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}