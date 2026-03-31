import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../core/services/auth-service.service'; 

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private apiUrl = 'http://127.0.0.1:8000/api/admin'; 

  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  // Récupérer la liste de tous les employés
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Ajouter un employé
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees`, employeeData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Mettre à jour un employé
  updateEmployee(employeeId: number, employeeData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/${employeeId}`, employeeData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Supprimer un employé
  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${employeeId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Activer ou désactiver un client
  toggleClientStatus(clientId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/clients/${clientId}/toggle`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Supprimer un client
  deleteClient(clientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/destroy-client/${clientId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}