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
    this.errorMessage = 'Les mots de passe ne correspondent pas';
    return;
  }
  this.loading = true;
  this.auth.registerClient(this.form).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = err?.error?.error || err?.error?.message || 'Échec de l\'inscription';
    }
  });

  }
}