import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, private authService: AuthServiceService){}

logout() {
  this.authService.logout().subscribe(
    (response:any) => {  
      console.log(response); 
      if (response) {
        localStorage.removeItem('access_token');
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {
        console.log('Logout failed');
      }
    }
  );
}}
