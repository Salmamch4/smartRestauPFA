import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getPending().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur de chargement des commandes';
        this.loading = false;
      }
    });
  }

  invalidateItem(orderId: number, itemId: number): void {
    this.orderService.invalidateItem(orderId, itemId).subscribe({
      next: () => {
        this.successMessage = 'Produit marqué comme indisponible';
        this.loadOrders();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la modification';
      }
    });
  }

  startOrder(id: number): void {
    this.orderService.start(id).subscribe({
      next: () => {
        this.successMessage = 'Commande en cours de préparation';
        this.loadOrders();
      },
      error: () => {
        this.errorMessage = 'Erreur';
      }
    });
  }

  completeOrder(id: number): void {
    this.orderService.complete(id).subscribe({
      next: () => {
        this.successMessage = 'Commande prête !';
        this.loadOrders();
      },
      error: () => {
        this.errorMessage = 'Erreur';
      }
    });
  }

  cancelOrder(id: number): void {
    this.orderService.cancel(id).subscribe({
      next: () => {
        this.successMessage = 'Commande annulée';
        this.loadOrders();
      },
      error: () => {
        this.errorMessage = 'Erreur';
      }
    });
  }
}