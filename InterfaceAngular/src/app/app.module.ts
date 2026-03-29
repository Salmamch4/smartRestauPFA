import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';

import { HomeComponent } from './auth/components/home/home.component';
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';

import { CreateArticleComponent } from './menu/components/create-article/create-article.component';
import { ArticleListComponent } from './menu/components/article-list/article-list.component';
import { UpdateArticleComponent } from './menu/components/update-article/update-article.component';

// AUTH (صلح حتى هادو)
import { ProfileComponent } from './auth/components/profile/profile.component';
import { RolesComponent } from './auth/components/roles/roles.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    HomeComponent,
CreateArticleComponent,
ArticleListComponent,
UpdateArticleComponent,
    ResetPasswordComponent,

    RolesComponent,
    ProfileComponent,
    AdminDashboardComponent
    // J'ai supprimé le deuxième "RegisterComponent" qui créait une erreur
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,

    HttpClientModule,
    FormsModule,         
    ReactiveFormsModule  

  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

