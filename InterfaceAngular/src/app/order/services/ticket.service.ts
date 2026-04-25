import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private api = 'http://localhost:8083/api/tickets';

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
  create(ticket: any) {
  return this.http.post('http://localhost:8083/api/tickets', ticket);
}
}