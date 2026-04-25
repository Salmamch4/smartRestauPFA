import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-ticket',
  templateUrl: './admin.component.html'
})
export class AdminTicketComponent implements OnInit {

  tickets: any[] = [];
  totalGlobal: number = 0;
  today: Date = new Date();

  isDuplicate: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  // 🔥 LOAD (admin endpoint)
  loadTickets() {
    this.http.get<any[]>('http://localhost:8083/api/tickets/admin')
      .subscribe({
        next: (data) => {
          this.tickets = data;

          this.totalGlobal = this.tickets.reduce(
            (sum, t) => sum + (t.total || 0),
            0
          );
        },
        error: (err) => {
          console.error(err);
          alert("Erreur API");
        }
      });
  }

  // 🔥 CLEAR (backend)
  clearTodayView() {
    this.http.post('http://localhost:8083/api/tickets/admin/clear', {})
      .subscribe({
        next: () => {
          this.tickets = [];
          this.totalGlobal = 0;
        },
        error: () => {
          alert("Erreur clear");
        }
      });
  }

  // 🔥 PRINT
  print() {

    const content = document.getElementById('ticket');
    if (!content) return;

    const win = window.open('', '', 'width=600,height=600');

    if (!win) {
      alert("Allow popup !");
      return;
    }

    const duplicataText = this.isDuplicate
      ? "<h3 style='text-align:center'>DUPLICATA</h3>"
      : "";

    win.document.write(`
      <html>
        <head>
          <title>Admin Ticket</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>

          <h2>SMART RESTO</h2>
          ${duplicataText}

          ${content.innerHTML}

        </body>
      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.print();
      win.close();

      // 🔥 من بعد أول print → duplicata
      this.isDuplicate = true;

    }, 500);
  }
}