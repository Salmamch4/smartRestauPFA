import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderCreate } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8083/api/orders';

  constructor(private http: HttpClient) {}

  // ==================== CRUD ====================

  // Toutes les commandes
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Créer une commande (pour test)
  create(order: OrderCreate): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  // Supprimer une commande
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==================== CHEF CUISINIER ====================

  // Commandes EN_ATTENTE
  getPending(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending`);
  }

  // Commandes EN_COURS
  getInProgress(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/inprogress`);
  }

  // Invalider un produit
  invalidateItem(orderId: number, itemId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/items/${itemId}/invalidate`, {});
  }

  // Client accepte
  clientAccepts(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/accept`, {});
  }

  // Annuler
  cancel(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Chef commence
  start(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/start`, {});
  }

  // Chef termine
  complete(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/complete`, {});
  }
}