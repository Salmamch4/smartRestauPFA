import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Auth
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';
import { RolesComponent } from './auth/components/roles/roles.component';

// Menu
import { AddAchatsComponent } from './menu/components/achats/add-achats/add-achats.component';
import { ListAchatsComponent } from './menu/components/achats/list-achats/list-achats.component';
import { UpdateAchatsComponent } from './menu/components/achats/update-achats/update-achats.component';

import { CreateArticleComponent } from './menu/components/articles/create-article/create-article.component';
import { ArticleListComponent } from './menu/components/articles/article-list/article-list.component';
import { UpdateArticleComponent } from './menu/components/articles/update-article/update-article.component';

import { AddCategorieComponent } from './menu/components/categories/add-categorie/add-categorie.component';
import { ListCategorieComponent } from './menu/components/categories/list-categorie/list-categorie.component';


import { CatalogueComponent } from './catalogue/catalogue/catalogue.component';
import { CommandeComponent } from './catalogue/commande/commande.component';
import { MesCommandesComponent } from './catalogue/mes-commandes/mes-commandes.component';


import { AddProduitComponent } from './menu/components/produits/add-produit/add-produit.component';
import { ProductListComponent } from './menu/components/produits/product-list/product-list.component';
import { ProductEditComponent } from './menu/components/produits/product-edit/product-edit.component';

import { AddFournisseurComponent } from './menu/components/fournisseurs/add-fournisseur/add-fournisseur.component';
import { ListFournisseursComponent } from './menu/components/fournisseurs/list-fournisseurs/list-fournisseurs.component';
import { EditFournisseurComponent } from './menu/components/fournisseurs/edit-fournisseur/edit-fournisseur.component';

// Order (✔️ التصحيح هنا)
import { ListOrdersComponent } from './order/components/chef-cuisinier/list-orders/list-orders.component';
import { ServeurTicketComponent } from './order/components/ticket/serveur/serveur-ticket.component';
import { ClientComponent } from './order/components/ticket/client/client.component';
import { AdminTicketComponent } from './order/components/ticket/admin/admin.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'role', component: RolesComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  // Achats
  { path: 'add-achats', component: AddAchatsComponent },
  { path: 'list-achats', component: ListAchatsComponent },
  { path: 'achats/update-achats/:id', component: UpdateAchatsComponent },

  // Articles
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/create', component: CreateArticleComponent },
  { path: 'articles/update/:id', component: UpdateArticleComponent },

  // Catégories
  { path: 'add-categorie', component: AddCategorieComponent },
  { path: 'list-categories', component: ListCategorieComponent },


// Catalogue routes
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'commande', component: CommandeComponent },
  { path: 'mes-commandes', component: MesCommandesComponent },

  { path: 'edit-categorie/:id', component: AddCategorieComponent },

  // Fournisseurs
  { path: 'add-fournisseur', component: AddFournisseurComponent },
  { path: 'list-fournisseurs', component: ListFournisseursComponent },
  { path: 'edit-fournisseur/:id', component: EditFournisseurComponent },

  // Produits
  { path: 'add-produit', component: AddProduitComponent },
  { path: 'list-produits', component: ProductListComponent },
  { path: 'menu/produits/edit/:id', component: ProductEditComponent },

  { path: 'client-ticket', component: ClientComponent },
  { path: 'serveur-ticket', component: ServeurTicketComponent },
  { path: 'admin-ticket', component: AdminTicketComponent },

  // Chef
    { path: 'chef-dashboard', component: ListOrdersComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}