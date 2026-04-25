import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur/fournisseur.service';

@Component({
  selector: 'app-edit-fournisseur',
  templateUrl: './edit-fournisseur.component.html',
  styleUrls: ['./edit-fournisseur.component.css']
})
export class EditFournisseurComponent implements OnInit {
  id: string = '';
  ice = '';
  raisonSocial = '';
  telephone = '';
  adresse = '';
  
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID récupéré:', this.id);
    
    if (this.id) {
      this.loadFournisseur();
    } else {
      this.errorMessage = 'ID du fournisseur non trouvé';
    }
  }

  loadFournisseur(): void {
    this.loading = true;
    console.log('Chargement du fournisseur ID:', this.id);
    
    this.fournisseurService.getById(this.id).subscribe({
      next: (data) => {
        console.log('Données brutes de l\'API:', JSON.stringify(data, null, 2));
        
        // Essayer tous les noms possibles pour raison sociale
        this.raisonSocial = data.raisonSocial || 
                           data.raison_social || 
                           data.RaisonSocial || 
                           data.raisonSociale ||
                           data.raison_sociale ||
                           '';
        
        this.ice = data.ice || data.ICE || data.Ice || '';
        this.telephone = data.telephone || data.Telephone || '';
        this.adresse = data.adresse || data.Adresse || '';
        
        console.log('Données mappées:', {
          ice: this.ice,
          raisonSocial: this.raisonSocial,
          telephone: this.telephone,
          adresse: this.adresse
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        this.errorMessage = 'Erreur lors du chargement du fournisseur';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.ice || !this.raisonSocial || !this.telephone || !this.adresse) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = {
      raisonSocial: this.raisonSocial,
      telephone: this.telephone,
      ice: this.ice,
      adresse: this.adresse
    };

    console.log('Mise à jour des données:', updateData);

    this.fournisseurService.update(this.id, updateData).subscribe({
      next: () => {
        this.successMessage = 'Fournisseur modifié avec succès!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/list-fournisseurs']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors de la modification';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.loadFournisseur();
  }

  goBack(): void {
    this.router.navigate(['/list-fournisseurs']);
  }
}