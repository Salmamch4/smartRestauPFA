import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  roles: any[] = [];
  newRole: string = '';
  editId: number | null = null;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

 loadRoles() {
  this.roleService.getAll().subscribe((data: any) => {
  this.roles = data.data ?? data;
});
}

  saveRole(): void {
    if (!this.newRole.trim()) return;

    const payload = { name: this.newRole };

    if (this.editId !== null) {
      this.roleService.update(this.editId, payload).subscribe(() => {
        this.resetForm();
        this.loadRoles();
      });
    } else {
      this.roleService.create(payload).subscribe(() => {
        this.resetForm();
        this.loadRoles();
      });
    }
  }

  edit(role: any): void {
    this.newRole = role.name;
    this.editId = role.id;
  }

  delete(id: number): void {
    this.roleService.delete(id).subscribe(() => {
      this.loadRoles();
    });
  }

  resetForm(): void {
    this.newRole = '';
    this.editId = null;
  }
  
}