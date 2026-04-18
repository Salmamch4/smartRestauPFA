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

import { CreateArticleComponent } from './menu/components/articles/create-article/create-article.component';
import { ArticleListComponent } from './menu/components/articles/article-list/article-list.component';
import { UpdateArticleComponent } from './menu/components/articles/update-article/update-article.component';

// Autres Composants
import { RolesComponent } from './auth/components/roles/roles.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import { AddAchatsComponent } from './menu/components/achats/add-achats/add-achats.component';
import { ListAchatsComponent } from './menu/components/achats/list-achats/list-achats.component';
import { UpdateAchatsComponent } from './menu/components/achats/update-achats/update-achats.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { AddCategorieComponent } from './menu/components/categories/add-categorie/add-categorie.component';
import { ListCategorieComponent } from './menu/components/categories/list-categorie/list-categorie.component';


import { AddFournisseurComponent } from './menu/components/fournisseurs/add-fournisseur/add-fournisseur.component';
import { ListFournisseursComponent } from './menu/components/fournisseurs/list-fournisseurs/list-fournisseurs.component';
import { EditFournisseurComponent } from './menu/components/fournisseurs/edit-fournisseur/edit-fournisseur.component';
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
    AdminDashboardComponent,
    AddAchatsComponent,
    ListAchatsComponent,
    UpdateAchatsComponent,
    NavbarComponent,
    AddCategorieComponent,
    ListCategorieComponent,

      AddFournisseurComponent,
    ListFournisseursComponent,
    EditFournisseurComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,
    FormsModule,         
    ReactiveFormsModule  

  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}