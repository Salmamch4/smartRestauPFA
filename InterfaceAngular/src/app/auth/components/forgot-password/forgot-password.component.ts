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
  
  this.authService.forgot(form.value.email).subscribe(
    (res: any) => {
      this.message = res.message;
      this.wait = false;
    },
    (err: any) => {
      this.error = err.status === 400 
        ? { email: 'Cette adresse email n\'existe pas.' }
        : err.error?.errors || { email: 'Une erreur est survenue.' };
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
