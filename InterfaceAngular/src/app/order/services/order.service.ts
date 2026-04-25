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

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  create(order: OrderCreate): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==================== CHEF CUISINIER ====================

  getPending(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending`);
  }

  getInProgress(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/inprogress`);
  }

  invalidateItem(orderId: number, itemId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/items/${itemId}/invalidate`, {});
  }

  // ✅ NOUVEAU - Revalider un item
  revalidateItem(orderId: number, itemId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/items/${itemId}/revalidate`, {});
  }

  clientAccepts(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/accept`, {});
  }

  cancel(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }

  start(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/start`, {});
  }

  complete(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/complete`, {});
  }
}