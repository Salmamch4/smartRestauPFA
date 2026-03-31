import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { HomeComponent } from './auth/components/home/home.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';

import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';
import { AddAchatsComponent } from './menu/components/achats/add-achats/add-achats.component';
import { ListAchatsComponent } from './menu/components/achats/list-achats/list-achats.component';
import { UpdateAchatsComponent } from './menu/components/achats/update-achats/update-achats.component';
import { RolesComponent } from './auth/components/roles/roles.component';

import { CreateArticleComponent } from './menu/components/articles/create-article/create-article.component';
import { ArticleListComponent } from './menu/components/articles/article-list/article-list.component';
import { UpdateArticleComponent } from './menu/components/articles/update-article/update-article.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {path: 'reset-password', component: ResetPasswordComponent},


   { path: 'password/reset', redirectTo: '/reset-password' },


  { path: 'profile', component: ProfileComponent },
  { path: 'role', component: RolesComponent},
  // Ta route pour l'administration
  { path: 'admin-dashboard', component: AdminDashboardComponent },

// achats routes
  {path: 'add-achats', component: AddAchatsComponent},
  {path: 'list-achats', component: ListAchatsComponent},
   { path: 'achats/update-achats/:id', component: UpdateAchatsComponent },  
    { path: 'articles', component: ArticleListComponent },
  { path: 'articles/create', component: CreateArticleComponent },
  { path: 'articles/update/:id', component: UpdateArticleComponent },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }