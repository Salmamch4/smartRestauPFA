// src/app/auth/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  fieldErrors: { telephone?: string; password?: string } = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole();
    }

    this.loginForm = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.fieldErrors = {};
      this.errorMessage = '';
    });
  }

  redirectByRole(): void {
    const user = this.authService.getCurrentUser();
    const role = user?.role?.toLowerCase();
    this.navigateByRole(role);
  }

  navigateByRole(role: string): void {
    switch(role) {
      case 'client':
        this.router.navigate(['/catalogue']);
        break;
      case 'admin':
      case 'administrateur':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'server':
        this.router.navigate(['/server-dashboard']);
        break;
      case 'chef_cuisine':
      case 'chef cuisine':
        this.router.navigate(['/chef-dashboard']);
        break;
      default:
        this.router.navigate(['/catalogue']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.fieldErrors = {};

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful!', response);
        
        // ✅ Mettre à jour l'état d'authentification
        this.authStateService.updateAuthState();
        
        const user = response.user;
        const role = user?.role?.toLowerCase();
        this.navigateByRole(role);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);

        if (error.status === 401) {
          if (error.error?.errors) {
            if (error.error.errors.telephone) {
              this.fieldErrors.telephone = error.error.errors.telephone[0];
            }
            if (error.error.errors.password) {
              this.fieldErrors.password = error.error.errors.password[0];
            }
          } else {
            this.errorMessage = error.error?.error || 'Numéro de téléphone ou mot de passe incorrect';
          }
        } else if (error.status === 0) {
          this.errorMessage = 'Serveur indisponible. Vérifiez que Laravel est démarré (php artisan serve)';
        } else if (error.status === 422) {
          if (error.error?.errors) {
            if (error.error.errors.telephone) {
              this.fieldErrors.telephone = error.error.errors.telephone[0];
            }
            if (error.error.errors.password) {
              this.fieldErrors.password = error.error.errors.password[0];
            }
          }
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  get telephone() { return this.loginForm.get('telephone'); }
  get password() { return this.loginForm.get('password'); }
}