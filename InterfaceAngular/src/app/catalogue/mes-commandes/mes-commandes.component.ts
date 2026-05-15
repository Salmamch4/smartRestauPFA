// src/app/commande/mes-commandes/mes-commandes.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../order/services/ticket.service';
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
  successMessage = '';
  telephone: string = '';
  
  // ✅ Variables pour le ticket
  selectedTicket: any = null;
  showTicketModal = false;
  copie = false;

  constructor(
    private commandeService: CommandeService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.telephone = localStorage.getItem('telephone') || '';
    if (this.telephone && this.telephone.length === 10) {
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

 // mes-commandes.component.ts
viewTicket(orderId: string, orderStatus: string): void {
    if (orderStatus !== 'PRETE' && orderStatus !== 'LIVREE') {
        alert('Le ticket sera disponible quand la commande sera prête.');
        return;
    }
    
    console.log('🔍 Recherche ticket pour orderId:', orderId);
    
    this.ticketService.getTicketByOrderId(orderId).subscribe({
        next: (response: any) => {
            console.log('✅ Réponse reçue:', response);
            // Si la réponse est un tableau, prendre le premier élément
            const ticket = Array.isArray(response) ? response[0] : response;
            
            if (ticket) {
                this.selectedTicket = ticket;
                this.showTicketModal = true;
                this.copie = false;
            } else {
                alert('Aucun ticket trouvé pour cette commande.');
            }
        },
        error: (err) => {
            console.error('❌ Erreur:', err);
            alert('Erreur lors du chargement du ticket.');
        }
    });
}
  // ✅ Fermer le ticket
  closeTicket(): void {
    this.showTicketModal = false;
    this.selectedTicket = null;
  }

  // ✅ Imprimer le ticket
  printTicket(): void {
    window.print();
    setTimeout(() => {
      this.copie = true;
    }, 300);
  }

  getStatusClass(statut: string): string {
    switch(statut) {
      case 'EN_CONFIRMATION': return 'bg-warning';
      case 'CONFIRMEE': return 'bg-success';
      case 'EN_PREPARATION': return 'bg-info';
      case 'PRETE': return 'bg-primary';
      case 'LIVREE': return 'bg-secondary';
      case 'REJETEE': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(statut: string): string {
    switch(statut) {
      case 'EN_CONFIRMATION': return 'En confirmation';
      case 'CONFIRMEE': return 'Confirmée';
      case 'EN_PREPARATION': return 'En préparation';
      case 'PRETE': return 'Prête';
      case 'LIVREE': return 'Livrée';
      case 'REJETEE': return 'Rejetée';
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