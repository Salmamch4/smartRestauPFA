import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin-dashboard']);
    }

    this.loginForm = this.fb.group({
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', Validators.required]
    });

    // Clear field errors when user types
    this.loginForm.valueChanges.subscribe(() => {
      this.fieldErrors = {};
      this.errorMessage = '';
    });
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
        
        // Show success message
        this.showMessage('Connexion réussie!', 'success');
        
        // Redirect to dashboard
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);

        // Handle different error types
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

  showMessage(message: string, type: string): void {
    // You can implement a toast/notification service here
    alert(message);
  }

  get telephone() { return this.loginForm.get('telephone'); }
  get password() { return this.loginForm.get('password'); }
}