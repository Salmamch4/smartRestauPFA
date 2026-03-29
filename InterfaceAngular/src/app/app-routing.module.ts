import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// AUTH
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { HomeComponent } from './auth/components/home/home.component';
import { AdminDashboardComponent } from './auth/components/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './auth/components/profile/profile.component';

// ARTICLES ✅
import { CreateArticleComponent } from './menu/components/create-article/create-article.component';
import { ArticleListComponent } from './menu/components/article-list/article-list.component';
import { UpdateArticleComponent } from './menu/components/update-article/update-article.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // AUTH
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'password/reset', redirectTo: '/reset-password' },

  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  // ARTICLES
  { path: 'articles', component: ArticleListComponent },
  { path: 'create-article', component: CreateArticleComponent },
  { path: 'update-article/:id', component: UpdateArticleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}