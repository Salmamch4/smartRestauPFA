import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // ← IMPORT MANQUANT
import { AuthServiceService } from '../../core/services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthServiceService,
    private router: Router  // ← AJOUTER CE PARAMÈTRE
  ) {}

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (response) => {
        this.user = response.data;
        console.log('User loaded:', this.user);
      },
      error: (error) => {
        console.error('Failed to get user', error);
        // Si erreur 401, rediriger vers login
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
logout() {
  this.authService.logout().subscribe(
    (response:any) => {
      console.log(response);
      if (response) {
        localStorage.removeItem('access_token');
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {
        console.log('Logout failed');
      }
    }
  );
}}
