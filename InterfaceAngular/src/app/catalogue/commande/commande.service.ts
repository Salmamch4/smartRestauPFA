// src/app/services/commande/commande.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommandeResponse {
  id: string;
  numeroCommande: string;
  nomClient: string;
  telephone: string;
  numeroTable: number;
  statut: string;
  total: number;
  dateCommande: string;
  items?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:5000/api/commandes';

  constructor(private http: HttpClient) {}

   createOrder(commandeData: any): Observable<CommandeResponse> {
    return this.http.post<CommandeResponse>(this.apiUrl, commandeData);
  }

  // Récupérer les commandes par téléphone
  getOrdersByTelephone(telephone: string): Observable<CommandeResponse[]> {
    return this.http.get<CommandeResponse[]>(`${this.apiUrl}/telephone/${telephone}`);
  }

  getOrderById(id: string): Observable<CommandeResponse> {
    return this.http.get<CommandeResponse>(`${this.apiUrl}/${id}`);
  }
}