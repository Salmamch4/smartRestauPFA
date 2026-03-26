import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

    error: { email: string | null } = {  
    email: null
  };
  message:any;
  wait:boolean = false;
constructor(private router: Router, private authService: AuthServiceService){}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
  this.wait = true;
  this.error.email = null;
  this.message = ''; // Reset message
  
  this.authService.forgot(form.value.email).subscribe(
    (res: any) => {
      this.message = res.message;
      this.wait = false;
    },
    (err: any) => {
      console.log('Erreur complète:', err); // Pour debug
      
      // Gestion des différents types d'erreurs
      if (err.status === 400) {
        // Email n'existe pas
        this.error = { email: err.error?.message || 'Cette adresse email n\'existe pas.' };
      } 
      else if (err.status === 422) {
        // Erreur de validation (format email invalide)
        this.error = err.error?.errors || { email: 'Format email invalide.' };
      }
      else if (err.status === 404) {
        // Route non trouvée
        this.error = { email: 'Service indisponible.' };
      }
      else {
        // Autres erreurs
        this.error = { email: 'Une erreur est survenue. Réessayez plus tard.' };
      }
      
      this.wait = false;
    }
  );
}
 /*onSubmit(form: NgForm) {
  const email=form.value.email;
  this.authService.forgot(email).subscribe(
    (res: any) => {
      console.log(res)
    },(err: any) => {
      console.log(err);
      this.error=err.error.errors;})
}*/
}