import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur/fournisseur.service';

@Component({
  selector: 'app-add-fournisseur',
  templateUrl: './add-fournisseur.component.html',
  styleUrls: ['./add-fournisseur.component.css']
})
export class AddFournisseurComponent {
  ice = '';
  raisonSocial = '';  
  telephone = '';
  adresse = '';
  
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.ice || !this.raisonSocial || !this.telephone || !this.adresse) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const fournisseurData = {
      ice: this.ice,
      raisonSocial: this.raisonSocial,  // Utiliser raisonSocial
      telephone: this.telephone,
      adresse: this.adresse
    };

    this.fournisseurService.add(fournisseurData).subscribe({
      next: (response) => {
        console.log('Fournisseur ajouté:', response);
        this.successMessage = 'Fournisseur ajouté avec succès!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/list-fournisseurs']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors de l\'ajout du fournisseur';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.ice = '';
    this.raisonSocial = '';
    this.telephone = '';
    this.adresse = '';
    this.successMessage = '';
    this.errorMessage = '';
  }
}