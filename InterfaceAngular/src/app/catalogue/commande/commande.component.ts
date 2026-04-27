// src/app/commande/commande/commande.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PanierService } from '../catalogue/panier.service';
import { CommandeService } from '../commande/commande.service';
import { ClientService } from '../client/client.service';
import { ClientInfo } from '../client/client.model';
@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  commandeForm!: FormGroup;
  panier: any;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private panierService: PanierService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.panier = this.panierService.getCurrentPanier();
    
    if (this.panier.items.length === 0) {
      this.router.navigate(['/catalogue']);
    }

    this.initForm();
  }

  initForm(): void {
    this.commandeForm = this.fb.group({
      nomClient: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      numeroTable: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.commandeForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    localStorage.setItem('telephone', this.commandeForm.value.telephone);

    const commandeData = {
      nomClient: this.commandeForm.value.nomClient,
      telephone: this.commandeForm.value.telephone,
      numeroTable: this.commandeForm.value.numeroTable,
      total: this.panier.total,
      items: this.panier.items.map((item: any) => ({
        produitId: item.produitId,
        produitLibelle: item.libelle,
        quantite: item.quantite,
        prixUnitaire: item.prix_unitaire
      }))
    };

    console.log('📤 Envoi commande:', commandeData);

    this.commandeService.createOrder(commandeData).subscribe({
      next: (response) => {
        console.log('✅ Réponse reçue:', response);
        this.loading = false;
        this.successMessage = '✅ Commande envoyée avec succès!';
        this.panierService.viderPanier();
        
        setTimeout(() => {
          this.router.navigate(['/mes-commandes']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Erreur complète:', err);
        
        // ✅ Afficher l'erreur détaillée
        if (err.error) {
          this.errorMessage = err.error.message || JSON.stringify(err.error);
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Erreur lors de la commande';
        }
      }
    });
  }

  retourCatalogue(): void {
    this.router.navigate(['/catalogue']);
  }
  
}