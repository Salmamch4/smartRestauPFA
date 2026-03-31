// src/app/app.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  // This method determines if the navbar/sidebar should be visible
  public shouldShowNavbar(): boolean {
    const url = this.router.url;
    // Hide navbar and sidebar on these routes
    return !(url === '/login' || url === '/register' || url.includes('forgot-password') || url.includes('reset-password'));
  }

isAuthPage(url?: string): boolean {
    const currentUrl = url || this.router.url;
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    return authPages.some(page => currentUrl.includes(page));
  }

}//<app-navbar *ngIf="shouldShowNavbar()"></app-navbar>
