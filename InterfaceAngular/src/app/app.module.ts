import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants Auth
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { HomeComponent } from './auth/components/home/home.component';
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';

// Autres Composants
import { RolesComponent } from './roles/roles.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    HomeComponent,
    ResetPasswordComponent,
    RolesComponent,
    ProfileComponent,
    AdminDashboardComponent
    // J'ai supprimé le deuxième "RegisterComponent" qui créait une erreur
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,    // Ajouté pour tes services API
    FormsModule,         // Ajouté pour ngModel
    ReactiveFormsModule  // Ajouté pour tes formulaires réactifs
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }