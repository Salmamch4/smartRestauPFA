import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ResetResponse } from '../models/auth-response.model';

export interface LoginRequest {
  telephone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    telephone: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      console.error('Server Error:', error);

      if (error.status === 401) {
        errorMessage = error.error?.error || 'Invalid phone number or password';
      } else if (error.status === 422) {
        // Validation errors
        return throwError(() => error);
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Make sure Laravel is running.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

   logout(): Observable<any>
  {
        const token = localStorage.getItem('access_token');
        console.log('Token being sent:', token);
        const headers=new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        return this.http.post<any>(`${this.apiUrl}/auth/logout`,{},{headers});

  }

    forgot(email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/password/forgot`, { email });
  }

   reset(token: string, password: string, password_confirmation: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/password/reset/${token}`, {
    password,
    password_confirmation
  });
}


}
