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

  copie: boolean = false; // 👈 مهم ل DUPLICATA
  today: Date = new Date();

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

  chooseTicket(t: any) {
    this.selectedTicket = t;
    this.copie = false; // 👈 reset
  }

  printClient() {
    window.print();

    // 👇 من بعد print يظهر DUPLICATA
    setTimeout(() => {
      this.copie = true;
    }, 300);
  }
}