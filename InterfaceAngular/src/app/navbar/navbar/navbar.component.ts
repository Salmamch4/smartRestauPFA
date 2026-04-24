// navbar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth/core/services/auth-service.service';

// Définissez l'interface localement
export interface User {
  id: string;
  telephone: string;
  email: string;
  role_id: string;
  role: string;
  is_active: boolean | string;
  nom?: string;
  prenom?: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() showSidebar: boolean = true;
  openSubmenu: string | null = null;
  user: User | null = null;
  isAdmin: boolean = true;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    // Récupérer l'utilisateur depuis localStorage directement
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.isAdmin = this.user?.role === 'ADMIN';
        console.log('User loaded in navbar:', this.user);
        console.log('Is admin:', this.isAdmin);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    } else {
      // Essayer via le service
      this.user = this.authService.getCurrentUser();
      this.isAdmin = this.user?.role === 'ADMIN';
      console.log('User from service:', this.user);
    }
  }

  toggleSubmenu(menu: string): void {
    if (this.openSubmenu === menu) {
      this.openSubmenu = null;
    } else {
      this.openSubmenu = menu;
    }
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Nettoyer le localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Appeler le logout du service
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('Logout error:', err);
          this.router.navigate(['/login']);
        }
      });
    }
  }
}