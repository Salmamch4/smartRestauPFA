// src/app/order/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/commandes';
  private menuApiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getPending(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending`);
  }

  getConfirmed(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/confirmed`);
  }

  getInProgress(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/inprogress`);
  }

  getReady(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/ready`);
  }

  getProductStock(productId: string): Observable<any> {
    return this.http.get<any>(`${this.menuApiUrl}/articles/${productId}/stock`).pipe(
      map(response => {
        return {
          quantiteEnStock: response.quantiteEnStock ?? 0,
          disponible: response.disponible ?? false,
          seuilAlerte: response.seuilAlerte ?? 10,
          message: response.message ?? 'Inconnu'
        };
      }),
      catchError(() => {
        return of({ quantiteEnStock: 0, disponible: false, seuilAlerte: 10, message: 'Erreur' });
      })
    );
  }

  getMultipleStocks(productIds: string[]): Observable<Map<string, any>> {
    const requests = productIds.map(id => this.getProductStock(id));
    return forkJoin(requests).pipe(
      map(results => {
        const stockMap = new Map<string, any>();
        results.forEach((result, index) => {
          stockMap.set(productIds[index], result);
        });
        return stockMap;
      })
    );
  }

  getOrdersWithStock(orders: Order[]): Observable<Order[]> {
    if (!orders || orders.length === 0) {
      return of([]);
    }
    
    const allProductIds: string[] = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!allProductIds.includes(item.produitId)) {
          allProductIds.push(item.produitId);
        }
      });
    });
    
    if (allProductIds.length === 0) {
      return of(orders);
    }
    
    return this.getMultipleStocks(allProductIds).pipe(
      map(stockMap => {
        return orders.map(order => ({
          ...order,
          items: order.items.map(item => {
            const stockInfo = stockMap.get(item.produitId);
            return {
              ...item,
              disponible: stockInfo?.disponible ?? false,
              stockDisponible: stockInfo?.quantiteEnStock ?? 0,
              seuilAlerte: stockInfo?.seuilAlerte ?? 10
            };
          })
        }));
      })
    );
  }

  confirm(orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/confirm`, {});
  }

  start(orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/start`, {});
  }

  complete(orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/complete`, {});
  }

  deliver(orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/deliver`, {});
  }

  cancel(orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  invalidateItem(orderId: string, itemId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/items/${itemId}/invalidate`, {});
  }

  revalidateItem(orderId: string, itemId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/items/${itemId}/revalidate`, {});
  }
}