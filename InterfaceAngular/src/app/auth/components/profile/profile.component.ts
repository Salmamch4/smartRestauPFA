import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // Données factices pour l'affichage (vous pouvez les remplacer par les vraies données)
  user = {
    nom: 'Administrateur',
    prenom: 'Principal',
    email: 'admin@smartresto.com',
    telephone: '+212 6 12 34 56 78',
    role: 'ADMIN',
    is_active: true
  };

  constructor(private router: Router) {}

  logout(): void {
    // Supprimer les tokens du localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }
}