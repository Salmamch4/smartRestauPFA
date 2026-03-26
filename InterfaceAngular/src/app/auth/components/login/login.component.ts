//import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  /*ngOnInit(): void {
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


        alert('Login successful!');
        // this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);

        // Handle different error types
        if (error.status === 401) {
          // Check if it's a field-specific error
          if (error.error?.errors) {
            // Laravel validation errors
            if (error.error.errors.telephone) {
              this.fieldErrors.telephone = error.error.errors.telephone[0];
            }
            if (error.error.errors.password) {
              this.fieldErrors.password = error.error.errors.password[0];
            }
          } else {
            // General error message
            this.errorMessage = error.error?.error || 'Invalid phone number or password';
          }
        } else if (error.status === 0) {
          this.errorMessage = 'Server unavailable. Make sure Laravel is running (php artisan serve)';
        } else if (error.status === 422) {
          // Validation errors
          if (error.error?.errors) {
            if (error.error.errors.telephone) {
              this.fieldErrors.telephone = error.error.errors.telephone[0];
            }
            if (error.error.errors.password) {
              this.fieldErrors.password = error.error.errors.password[0];
            }
          }
        } else {
          this.errorMessage = 'An error occurred. Please try again';
        }
      }
    });
  }

  get telephone() { return this.loginForm.get('telephone'); }
  get password() { return this.loginForm.get('password'); }*/

}
