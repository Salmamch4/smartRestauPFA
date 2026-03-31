// src/app/admin-dashboard/admin-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // Onglet par défaut : Gestion des Clients
  public viewTab: string = 'manage_clients'; 
  public allEmployees: any[] = [];
  public allClients: any[] = []; 

  // Modèle pour l'ajout d'un nouvel employé
  public newEmployee = {
    nom: '', 
    prenom: '', 
    email: '', 
    telephone: '',
    adresse: '', 
    poste: 'serveur', 
    salaire: 0,
    date_embauche: new Date().toISOString().split('T')[0]
  };

  // Statistiques du tableau de bord
  public stats: any = { 
    total_clients: 0, 
    total_employees: 0, 
    inactive_archives: 0 
  };

  private apiUrl = 'http://127.0.0.1:8000/api/admin';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllClients();
    this.loadStats();
  }

  // Changement d'onglet
  changeTab(tab: string) {
    this.viewTab = tab;
    if (tab === 'stats') this.loadStats();
    if (tab === 'manage_employees') this.fetchAllEmployees();
    if (tab === 'manage_clients') this.fetchAllClients();
  }

  // --- GESTION CLIENTS ---

  fetchAllClients() {
    this.http.get<any[]>(`${this.apiUrl}/clients`).subscribe({
      next: (res) => this.allClients = res,
      error: (err) => console.error("Erreur chargement clients", err)
    });
  }

  toggleClientStatus(client: any) {
    this.http.post(`${this.apiUrl}/clients/${client.id}/toggle`, {}).subscribe({
      next: () => {
        alert("Statut du compte mis à jour.");
        this.fetchAllClients();
      },
      error: (err) => console.error("Erreur lors du changement de statut", err)
    });
  }

  deleteClient(id: number) {
    if (confirm("Voulez-vous vraiment supprimer ce client ? Un email de notification lui sera envoyé.")) {
      this.http.delete(`http://127.0.0.1:8000/api/admin/destroy-client/${id}`).subscribe({
        next: () => {
          alert("Succès ! Le client a été supprimé et notifié.");
          this.fetchAllClients(); // Actualise la liste immédiatement
          this.loadStats();       // Actualise les chiffres
        },
        error: (err) => {
          console.error("Erreur lors de la suppression", err);
          alert("Échec de la suppression. Vérifiez la console.");
        }
      });
    }
  }

  // --- GESTION EMPLOYÉS ---

  fetchAllEmployees() {
    this.http.get<any[]>(`${this.apiUrl}/employees`).subscribe({
      next: (res) => this.allEmployees = res.map(e => ({...e, isEditing: false})),
      error: (err) => console.error("Erreur chargement employés", err)
    });
  }

  // Pour enregistrer les modifications (Bouton Sauvegarder)
  updateEmployee(emp: any) {
    this.http.put(`${this.apiUrl}/employees/${emp.id}`, emp).subscribe({
      next: () => { 
        alert("Employé mis à jour avec succès !"); 
        emp.isEditing = false; 
        this.fetchAllEmployees(); 
      },
      error: (err) => console.error("Erreur modification employé", err)
    });
  }

  deleteEmployee(id: number) {
    if(confirm("Supprimer cet employé définitivement ?")) {
      this.http.delete(`${this.apiUrl}/employees/${id}`).subscribe({
        next: () => {
          alert("Employé supprimé.");
          this.fetchAllEmployees();
          this.loadStats();
        },
        error: (err) => console.error("Erreur suppression employé", err)
      });
    }
  }

  onAddEmployee() {
    this.http.post(`${this.apiUrl}/employees`, this.newEmployee).subscribe({
      next: () => { 
        alert("Nouvel employé ajouté !"); 
        this.newEmployee = { nom: '', prenom: '', email: '', telephone: '', adresse: '', poste: 'serveur', salaire: 0, date_embauche: new Date().toISOString().split('T')[0] };
        this.changeTab('manage_employees'); 
      },
      error: (err) => console.error("Erreur ajout employé", err)
    });
  }

  // --- STATISTIQUES ---

  loadStats() {
    this.http.get(`${this.apiUrl}/stats`).subscribe({
      next: (res) => this.stats = res,
      error: (err) => console.error("Erreur stats", err)
    });
  }
}