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
    console.log('Data from API:', data); 
    this.roles = data.data ?? data; 
  }, (error) => {
    console.error('Error loading roles:', error); 
  });
}

saveRole() {
  if (!this.newRole.trim()) return;
  const payload = { nom: this.newRole };

  if (this.editId !== null) {
    this.roleService.update(this.editId, payload).subscribe(() => {
      this.loadRoles();
      this.resetForm();
    });
  } else {
    this.roleService.create(payload).subscribe(() => {
      this.loadRoles();
      this.resetForm();
    });
  }
}

  edit(role: any) {
  this.newRole = role.nom;
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