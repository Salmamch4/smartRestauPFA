import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  tickets: any[] = [];
  selectedTicket: any = null;
  copie = true;
  today = new Date();

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getAll().subscribe(data => {
      this.tickets = data;
      if (data.length > 0) {
        this.selectedTicket = data[data.length - 1];
      }
    });
  }

  chooseTicket(ticket: any) {
    this.selectedTicket = ticket;
  }

  printClient() {
    window.print();
  }
}