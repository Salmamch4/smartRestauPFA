import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-serveur-ticket',
  templateUrl: './serveur-ticket.component.html',
  styleUrls: ['./serveur-ticket.component.css']
})
export class ServeurTicketComponent {

  serveurName: string = '';
  tickets: any[] = [];
  totalJour: number = 0;
  today: Date = new Date();

  // 🔥 duplicata
  isDuplicate: boolean = false;

  constructor(private http: HttpClient) {}

  loadTickets() {

    if (!this.serveurName) {
      alert("دخل اسم serveur");
      return;
    }

    this.http.get<any[]>('http://localhost:8083/api/tickets')
      .subscribe({
        next: (data) => {

          console.log("ALL DATA:", data);

          // ✅ filter serveur
          this.tickets = data.filter(t =>
            t.serveur?.toLowerCase() === this.serveurName.toLowerCase()
          );

          // ✅ total du jour
          this.totalJour = this.tickets.reduce((sum, t) => sum + (t.total || 0), 0);
        },
        error: (err) => {
          console.error(err);
          alert("Erreur API");
        }
      });
  }

  // 🔥 PRINT + DUPLICATA
  print() {

    // أول مرة → ماشي duplicata
    // من بعد → duplicata
    setTimeout(() => {
      window.print();
      this.isDuplicate = true;
    }, 200);
  }
}