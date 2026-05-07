import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loading = false;
  stats = {
    total_clients: 4,
    total_employees: 10,
    total_orders: 12,
    total_revenue: 12500,
    pending_orders: 3
  };
  recentOrders: any[] = [];
  lowStockItems: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    setTimeout(() => {
      this.recentOrders = [
        { numeroCommande: 'CMD001', nomClient: 'Jean Dupont', total: 450, statut: 'LIVREE' },
        { numeroCommande: 'CMD002', nomClient: 'Marie Curie', total: 320, statut: 'EN_COURS' },
        { numeroCommande: 'CMD003', nomClient: 'Pierre Martin', total: 890, statut: 'CONFIRMEE' }
      ];
      this.lowStockItems = [
        { libelle: 'Tomates', quantiteStock: 2, seuilAlerte: 5 },
        { libelle: 'Fromage', quantiteStock: 1, seuilAlerte: 3 }
      ];
      this.loading = false;
      
      // Attendre que le DOM se mette à jour après loading=false
      setTimeout(() => {
        this.renderCharts();
      }, 100);
    }, 500);
  }

  renderCharts(): void {
    const canvasStatus = document.getElementById('statusChart') as HTMLCanvasElement;
    const canvasRevenue = document.getElementById('revenueChart') as HTMLCanvasElement;

    if (!canvasStatus || !canvasRevenue) {
      console.error('Canvas non trouvés');
      return;
    }

    // Nettoyer les graphiques existants
    let existingChart = Chart.getChart(canvasStatus);
    if (existingChart) existingChart.destroy();

    new Chart(canvasStatus, {
      type: 'doughnut',
      data: {
        labels: ['En cours', 'Confirmées', 'Rejetées', 'Livrées'],
        datasets: [{
          data: [5, 8, 2, 12],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      }
    });

    let existingChart2 = Chart.getChart(canvasRevenue);
    if (existingChart2) existingChart2.destroy();

    new Chart(canvasRevenue, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Chiffre d\'affaires (DH)',
          data: [8500, 9200, 10100, 9800, 11200, 12500],
          borderColor: '#4e73df',
          fill: false
        }]
      }
    });
  }
}