import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Fournisseur } from '../../models/achat.model';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  
  // ✅ URL de ton backend Fournisseur
  private apiUrl = 'https://localhost:7277/api/fournisseur';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les fournisseurs
  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl);
  }

  // ✅ Récupérer un fournisseur par ID
  getById(id: string): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${id}`);
  }

  // ✅ Récupérer un fournisseur par ICE
  getByICE(ice: string): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${ice}`);
  }

  // ✅ Ajouter un fournisseur (si besoin)
  add(fournisseur: any): Observable<any> {
    return this.http.post(this.apiUrl, fournisseur);
  }

  // ✅ Modifier un fournisseur
  update(id: string, fournisseur: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, fournisseur);
  }

  // ✅ Supprimer un fournisseur
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}