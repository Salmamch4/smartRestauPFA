import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  clients: any[] = [];
  selectedClient: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/clients')
      .subscribe(data => {
        this.clients = data;
      });
  }

  selectClient(client: any): void {
    this.selectedClient = { ...client };
  }

  updateClient(): void {

    if (!this.selectedClient) return;

    this.http.put(
      `http://127.0.0.1:8000/api/clients/${this.selectedClient.user_id}`,
      {
        nom: this.selectedClient.nom,
        email: this.selectedClient.email,
        telephone: this.selectedClient.telephone
      }
    ).subscribe({
      next: () => {
        alert("Updated successfully ✅");
        this.loadClients();
        this.selectedClient = null;
      },
      error: (err) => {
        console.error(err);
        alert("Error ❌");
      }
    });
  }

  deleteClient(user_id: number): void {

    if (!confirm("Are you sure you want to delete?")) return;

    this.http.delete(
      `http://127.0.0.1:8000/api/clients/${user_id}`
    ).subscribe(() => {
      alert("Deleted successfully 🗑");
      this.loadClients();
    });
  }
}