import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  token:any;

  constructor(private route:ActivatedRoute, private authService: AuthServiceService) { }

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
      this.message = res.message;
      console.log("Reset successful:", res.message); 
    },
    error: (err) => {
      this.error = err.error.errors;
      console.log("Error:", err.error.errors); 
    }
  });
}

}
