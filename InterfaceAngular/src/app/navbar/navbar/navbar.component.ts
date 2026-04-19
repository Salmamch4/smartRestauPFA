import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth/core/services/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() showSidebar: boolean = true;
  openSubmenu: string | null = null;
  user: any = null;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
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
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }
      });
    }
  }
  openTicket = false;

toggleTicket() {
  this.openTicket = !this.openTicket;
}
}