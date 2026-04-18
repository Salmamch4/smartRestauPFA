import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService  } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  loading = false;
  errorMessage = '';

  form = {
    nom: '',
    telephone: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  constructor(private auth: AuthServiceService , private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    if (this.form.password !== this.form.password_confirmation) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.auth.registerClient(this.form).subscribe({
      next: (res: any) => {
        if (res?.access_token) localStorage.setItem('token', res.access_token);
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.error?.error || 'Register failed';
      }
    });
  }
}