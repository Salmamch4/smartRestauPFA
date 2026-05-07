import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  telephone: string;
  email: string;
  role_id: string;
  role: string;
  is_active: boolean | string;
  nom?: string;
  prenom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private API = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        console.log('User loaded from storage:', user);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }

  // Méthode publique pour rafraîchir l’utilisateur courant (après mise à jour)
  refreshUser(): void {
    this.loadUserFromStorage();
  }

  registerClient(data: any): Observable<any> {
    return this.http.post(`${this.API}/auth/register-client`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API}/auth/login`, data).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API}/auth/logout`, {});
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return token !== null && user !== null;
  }

  updateProfile(data: any): Observable<any> {
  return this.http.put(`${this.API}/user/profile`, data);
}

updatePassword(data: any): Observable<any> {
  return this.http.put(`${this.API}/user/password`, data);
}


}