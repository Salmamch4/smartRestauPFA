// src/app/guards/client.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthServiceService } from '../auth/core/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    if (!token || !user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.role !== 'CLIENT') {
      console.log('❌ Accès client refusé pour rôle:', user.role);
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}