import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { RolesComponent } from './roles/roles.component';
import { ProfileComponent } from './profile/profile.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { HomeComponent } from './auth/components/home/home.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,         // ✅ ضروري ل ngModel
    ReactiveFormsModule  // ✅ اختياري (ماشي ضروري دابا)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}