// src/app/core/services/auth-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private authService: AuthServiceService) {
    this.loadInitialState();
  }

  loadInitialState(): void {
    this.isLoggedInSubject.next(this.authService.isLoggedIn());
    this.currentUserSubject.next(this.authService.getCurrentUser());
  }

  updateAuthState(): void {
    this.isLoggedInSubject.next(this.authService.isLoggedIn());
    this.currentUserSubject.next(this.authService.getCurrentUser());
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
      },
      error: () => {
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
      }
    });
  }
}