import { Component } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-serveur-ticket',
  templateUrl: './serveur-ticket.component.html',
  styleUrls: ['./serveur-ticket.component.css']
})
export class ServeurTicketComponent {

  serveurName: string = '';
  tickets: any[] = [];
  total: number = 0;
  today: Date = new Date();

  constructor(private ticketService: TicketService) {}

  loadTickets() {
    if (!this.serveurName) {
      alert('دخل اسم السيرفر');
      return;
    }

    this.ticketService.getServeur(this.serveurName).subscribe({
      next: (data) => {
        console.log('DATA:', data); // debug

        this.tickets = data;

        // 🔥 حساب total
        this.total = this.tickets.reduce((sum, t) => {
          return sum + (t.total || 0);
        }, 0);
      },

      error: (err) => {
        console.error('ERROR:', err);
        alert('مشكل فـ API ولا الاسم ديال السيرفر');
      }
    });
  }

  printServeur() {
    window.print();
  }
}