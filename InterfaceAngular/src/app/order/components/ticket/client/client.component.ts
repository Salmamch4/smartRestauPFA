// src/app/order/components/ticket/client/client.component.ts
import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  tickets: any[] = [];
  selectedTicket: any = null;
  copie: boolean = false;
  today: Date = new Date();
  loading = false;
  errorMessage = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.loading = true;
    this.ticketService.getAll().subscribe({
      next: (data) => {
        this.tickets = data;
        if (data.length > 0) {
          this.selectedTicket = data[data.length - 1];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des tickets';
        this.loading = false;
      }
    });
  }

  chooseTicket(t: any) {
    this.selectedTicket = t;
    this.copie = false;
  }

  printClient() {
    window.print();
    setTimeout(() => {
      this.copie = true;
    }, 300);
  }

  refresh() {
    this.loadTickets();
  }
}