import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar = false;

  // Routes où la navbar ne doit PAS apparaître
  hiddenRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/catalogue',
    '/chef-dashboard',
    '/mes-commandes'
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}