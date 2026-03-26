import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { NgForm } from '@angular/forms';


@Component({//new
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  token:any;

  constructor(private route:ActivatedRoute,private router: Router, private authService: AuthServiceService) { }

  error={
    password:null
  };
  message:any;

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
    this.token = param['token'];
    console.log('Token reçu:', this.token);
    })
  }

 onSubmit(form: NgForm) {
  const password = form.value.password;
  const password_confirmation = form.value.password_confirmation;

  this.authService.reset(this.token, password, password_confirmation).subscribe({
    next: (res: any) => {
      console.log("Reset successful:");

       this.router.navigate(['/login']);
      
    },
    error: (err) => {
      console.log('Erreur:', err);
      
      this.error = { 
        password: err.error?.message || 'Une erreur est survenue.' 
      };
    }
  });
}

}
