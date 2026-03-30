import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {}

  // Method to check if current route should show navbar
  public shouldShowNavbar(): boolean {
    const url = this.router.url;
    return !(url === '/login' || url === '/register' || url.includes('forgot-password'));
  }
}