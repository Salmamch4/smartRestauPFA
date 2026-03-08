// core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {  // ← Implémente CanActivate

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(() => {
        console.log('AuthGuard: User is authenticated');
        return true;
      }),
      catchError((error) => {
        console.log('AuthGuard: User is NOT authenticated', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
