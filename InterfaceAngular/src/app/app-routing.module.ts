import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { HomeComponent } from './auth/components/home/home.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';

import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/forgot-password', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent },
  {path: 'reset-password', component: ResetPasswordComponent},


   { path: 'password/reset', redirectTo: '/reset-password' },


  { path: 'profile', component: ProfileComponent },
  // Ta route pour l'administration
  { path: 'admin-dashboard', component: AdminDashboardComponent },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }