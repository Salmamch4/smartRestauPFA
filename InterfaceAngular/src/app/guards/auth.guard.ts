// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from '../auth/core/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    if (!token || !user) {
      console.log('❌ Non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return false;
    }

    // Vérifier le rôle requis
    const requiredRole = route.data['role'];
    if (requiredRole && user.role !== requiredRole) {
      console.log(`❌ Rôle ${user.role} non autorisé pour cette route (requis: ${requiredRole})`);
      
      // Rediriger selon le rôle
      if (user.role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (user.role === 'CLIENT') {
        this.router.navigate(['/client-dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }

    console.log('✅ Accès autorisé pour:', user.role);
    return true;
  }
}