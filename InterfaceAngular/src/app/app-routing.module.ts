import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ProfileComponent } from './profile/profile.component';


// CETTE LIGNE ÉTAIT MANQUANTE ET CAUSAIT L'ERREUR :
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  
  
  
  // Routes pour l'ADMIN
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  

  // Redirection de sécurité
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }