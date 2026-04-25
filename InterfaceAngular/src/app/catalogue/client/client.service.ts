// src/app/services/client/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Client, ClientInfo } from './client.model';
import { AuthServiceService } from '../../auth/core/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  getCurrentClient(): ClientInfo | null {
    return this.authService.getCurrentUser();
  }

  isClientConnected(): boolean {
    return this.authService.isLoggedIn();
  }

  getClientInfo(): Observable<ClientInfo | null> {
    const token = this.authService.getToken();
    if (!token) {
      return of(null);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ClientInfo>(`${this.apiUrl}/user`, { headers }).pipe(
      catchError(() => of(null))
    );
  }

  getClientId(): string | number | null {
    const client = this.getCurrentClient();
    return client ? client.id : null;
  }

  logout(): Observable<any> {
    return this.authService.logout();
  }
}
