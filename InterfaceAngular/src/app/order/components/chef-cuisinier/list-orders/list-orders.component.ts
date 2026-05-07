// src/app/order/components/chef-cuisinier/list-orders/list-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {
  
  pendingOrders: Order[] = [];
  confirmedOrders: Order[] = [];
  inProgressOrders: Order[] = [];
  readyOrders: Order[] = [];
  
  activeTab = 'pending';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getCurrentOrders(): Order[] {
    switch (this.activeTab) {
      case 'pending': return this.pendingOrders;
      case 'confirmed': return this.confirmedOrders;
      case 'inprogress': return this.inProgressOrders;
      case 'ready': return this.readyOrders;
      default: return [];
    }
  }

  loadAllOrders(): void {
    this.loading = true;
    
    this.orderService.getPending().subscribe({
      next: (data) => {
        // ✅ FORCER TOUS LES ARTICLES COMME DISPONIBLE
        this.pendingOrders = data.map(order => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            disponible: true,
            stockDisponible: 100
          }))
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur pending:', err);
        this.loading = false;
      }
    });
    
    this.orderService.getConfirmed().subscribe({
      next: (data) => {
        this.confirmedOrders = data.map(order => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            disponible: true,
            stockDisponible: 100
          }))
        }));
      },
      error: (err) => console.error('Erreur confirmed:', err)
    });
    
    this.orderService.getInProgress().subscribe({
      next: (data) => {
        this.inProgressOrders = data.map(order => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            disponible: true,
            stockDisponible: 100
          }))
        }));
      },
      error: (err) => console.error('Erreur inprogress:', err)
    });
    
    this.orderService.getReady().subscribe({
      next: (data) => {
        this.readyOrders = data.map(order => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            disponible: true,
            stockDisponible: 100
          }))
        }));
      },
      error: (err) => console.error('Erreur ready:', err)
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'EN_CONFIRMATION': 'En confirmation',
      'CONFIRMEE': 'Confirmée',
      'EN_PREPARATION': 'En préparation',
      'PRETE': 'Prête',
      'LIVREE': 'Livrée',
      'REJETEE': 'Annulée'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'EN_CONFIRMATION': 'badge-attente',
      'CONFIRMEE': 'badge-confirmee',
      'EN_PREPARATION': 'badge-cours',
      'PRETE': 'badge-prete'
    };
    return classMap[status] || 'badge-attente';
  }

  // ✅ TOUJOURS DISPONIBLE
  getStockStatus(item: any): { status: string; class: string; message: string } {
    return { status: 'dispo', class: 'status-dispo', message: '✓ Disponible' };
  }

  isRuptureStock(item: any): boolean {
    return false;
  }

  hasRuptureStock(order: Order): boolean {
    return false;
  }

  getRuptureItemsNames(order: Order): string {
    return '';
  }

  confirmOrder(orderId: string): void {
    if (confirm('Confirmer cette commande ?')) {
      this.orderService.confirm(orderId).subscribe({
        next: () => {
          this.successMessage = 'Commande confirmée !';
          this.loadAllOrders();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la confirmation';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  startOrder(orderId: string): void {
    this.orderService.start(orderId).subscribe({
      next: () => {
        this.successMessage = 'Préparation commencée';
        this.loadAllOrders();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  completeOrder(orderId: string): void {
    this.orderService.complete(orderId).subscribe({
      next: () => {
        this.successMessage = 'Commande prête';
        this.loadAllOrders();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  deliverOrder(orderId: string): void {
    this.orderService.deliver(orderId).subscribe({
      next: () => {
        this.successMessage = 'Commande livrée';
        this.loadAllOrders();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  cancelOrder(orderId: string): void {
    if (confirm('Annuler cette commande ?')) {
      this.orderService.cancel(orderId).subscribe({
        next: () => {
          this.successMessage = 'Commande annulée';
          this.loadAllOrders();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.errorMessage = 'Erreur';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  invalidateItem(orderId: string, itemId: string): void {
    this.orderService.invalidateItem(orderId, itemId).subscribe({
      next: () => {
        this.successMessage = 'Produit marqué indisponible';
        this.loadAllOrders();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  revalidateItem(orderId: string, itemId: string): void {
    this.orderService.revalidateItem(orderId, itemId).subscribe({
      next: () => {
        this.successMessage = 'Produit marqué disponible';
        this.loadAllOrders();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}