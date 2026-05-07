import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl; // ex: http://localhost:8080/api

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }

  getOrderStats(): Observable<any> {
    // Endpoint à créer dans votre microservice Commandes
    return this.http.get(`${this.apiUrl}/admin/order-stats`);
  }

  getRecentOrders(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/recent-orders?limit=${limit}`);
  }

  getLowStockItems(): Observable<any> {
    // Endpoint du microservice Menu
    return this.http.get(`${this.apiUrl}/menu/low-stock`);
  }
}