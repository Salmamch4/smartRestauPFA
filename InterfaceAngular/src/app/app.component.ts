// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthServiceService } from './auth/core/services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbarForAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Vérifier au démarrage
    this.checkNavbarVisibility();
    
    // Vérifier à chaque changement de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkNavbarVisibility();
      }
    });
  }

  checkNavbarVisibility(): void {
    const url = this.router.url;
    
    // Ne pas afficher sur les pages d'auth
    if (url === '/login' || url === '/register' || url.includes('forgot-password') || url.includes('reset-password')) {
      this.showNavbarForAdmin = false;
      return;
    }
    
    // Vérifier si l'utilisateur est admin
    const user = this.authService.getCurrentUser();
    this.showNavbarForAdmin = user?.role === 'ADMIN';
    
    console.log('Navbar visibility:', this.showNavbarForAdmin, 'User role:', user?.role);
  }

  isAuthPage(url?: string): boolean {
    const currentUrl = url || this.router.url;
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    return authPages.some(page => currentUrl.includes(page));
  }
}