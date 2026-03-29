import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  openSubmenu: string | null = null;

  toggleSubmenu(menu: string): void {
    if (this.openSubmenu === menu) {
      this.openSubmenu = null;
    } else {
      this.openSubmenu = menu;
    }
  }
}