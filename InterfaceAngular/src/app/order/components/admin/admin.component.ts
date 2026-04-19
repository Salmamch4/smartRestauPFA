import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-ticket',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminTicketComponent implements OnInit {

  tickets: any[] = [];
  totalGlobal: number = 0;

  today: Date = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>('http://localhost:8083/api/tickets')
      .subscribe(data => {
        this.tickets = data;

        // ✅ total global
        this.totalGlobal = this.tickets.reduce((sum, t) => sum + t.total, 0);
      });
  }

  print() {
    const content = document.getElementById('ticket');

    if (!content) return;

    const win = window.open('', '', 'width=600,height=600');

    if (!win) {
      alert("Allow popup !");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>Admin Ticket</title>
          <style>
            body { font-family: monospace; padding: 20px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  }
}