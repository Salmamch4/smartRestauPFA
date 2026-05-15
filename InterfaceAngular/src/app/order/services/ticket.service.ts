// src/app/order/services/ticket.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private api = 'http://localhost:5000/api/tickets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getServeur(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/serveur/${name}`);
  }

  getServeurTotal(name: string): Observable<number> {
    return this.http.get<number>(`${this.api}/serveur/total?name=${name}`);
  }

  getAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/admin`);
  }

  getAdminTotal(): Observable<number> {
    return this.http.get<number>(`${this.api}/admin/total`);
  }
  
  create(ticket: any): Observable<any> {
    return this.http.post(this.api, ticket);
  }
  
  getTicketByOrderId(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/order/${orderId}`).pipe(
      map((response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          return response[0];
        }
        return response;
      })
    );
  }
}