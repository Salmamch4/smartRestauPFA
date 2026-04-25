// src/app/catalogue/mes-commandes/mes-commandes.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from '../commande/commande.service';

@Component({
  selector: 'app-mes-commandes',
  templateUrl: './mes-commandes.component.html',
  styleUrls: ['./mes-commandes.component.css']
})
export class MesCommandesComponent implements OnInit {
  commandes: any[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';  // ✅ Ajouter cette ligne
  telephone: string = '';

  constructor(
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer le téléphone depuis localStorage
    this.telephone = localStorage.getItem('telephone') || '';
    if (this.telephone) {
      this.loadCommandes();
    }
  }

  loadCommandes(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.commandeService.getOrdersByTelephone(this.telephone).subscribe({
      next: (data) => {
        this.commandes = data;
        this.loading = false;
        console.log('Commandes chargées:', this.commandes);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement des commandes';
        this.loading = false;
      }
    });
  }

  rechercher(): void {
    if (this.telephone && this.telephone.length === 10) {
      localStorage.setItem('telephone', this.telephone);
      this.loadCommandes();
    } else {
      this.errorMessage = 'Veuillez entrer un numéro de téléphone valide (10 chiffres)';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    }
  }

  voirDetails(id: string): void {
    this.router.navigate(['/commande-details', id]);
  }

  getStatusClass(statut: string): string {
    switch(statut) {
      case 'CONFIRMEE': return 'bg-success';
      case 'REJETEE': return 'bg-danger';
      case 'LIVREE': return 'bg-info';
      default: return 'bg-warning';
    }
  }

  getStatusText(statut: string): string {
    switch(statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'CONFIRMEE': return 'Confirmée';
      case 'REJETEE': return 'Rejetée';
      case 'LIVREE': return 'Livrée';
      default: return statut;
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}