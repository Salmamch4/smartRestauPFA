import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Authentification
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import { RolesComponent } from './auth/components/roles/roles.component';
import { HomeComponent } from './auth/components/home/home.component';
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';

// Menu
import { CreateArticleComponent } from './menu/components/articles/create-article/create-article.component';
import { ArticleListComponent } from './menu/components/articles/article-list/article-list.component';
import { UpdateArticleComponent } from './menu/components/articles/update-article/update-article.component';
import { AddAchatsComponent } from './menu/components/achats/add-achats/add-achats.component';
import { ListAchatsComponent } from './menu/components/achats/list-achats/list-achats.component';
import { UpdateAchatsComponent } from './menu/components/achats/update-achats/update-achats.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { AddCategorieComponent } from './menu/components/categories/add-categorie/add-categorie.component';
import { ListCategorieComponent } from './menu/components/categories/list-categorie/list-categorie.component';

// Produits
import { AddProduitComponent } from './menu/components/produits/add-produit/add-produit.component';
import { ProductListComponent } from './menu/components/produits/product-list/product-list.component';
import { ProductEditComponent } from './menu/components/produits/product-edit/product-edit.component';

// Fournisseurs
import { AddFournisseurComponent } from './menu/components/fournisseurs/add-fournisseur/add-fournisseur.component';
import { ListFournisseursComponent } from './menu/components/fournisseurs/list-fournisseurs/list-fournisseurs.component';
import { EditFournisseurComponent } from './menu/components/fournisseurs/edit-fournisseur/edit-fournisseur.component';

// Order
import { ListOrdersComponent } from './order/components/chef-cuisinier/list-orders/list-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    RolesComponent,
    HomeComponent,
    AdminDashboardComponent,
    NavbarComponent,
    CreateArticleComponent,
    ArticleListComponent,
    UpdateArticleComponent,
    AddAchatsComponent,
    ListAchatsComponent,
    UpdateAchatsComponent,
    AddCategorieComponent,
    ListCategorieComponent,
    AddFournisseurComponent,
    ListFournisseursComponent,
    EditFournisseurComponent,
    AddProduitComponent,
    ProductListComponent,
    ProductEditComponent,
    ListOrdersComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }