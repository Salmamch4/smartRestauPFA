import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ عدّلي هاد السطر حسب المسار عندك
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = environment.apiUrl; //  http://127.0.0.1:8000/api

  constructor(private http: HttpClient) {}

  //  Register
  registerClient(data: any): Observable<any> {
    return this.http.post(`${this.API}/auth/register-client`, data);
  }

  // Login
  login(data: any): Observable<any> {
    return this.http.post(`${this.API}/auth/login`, data);
  }
}




