export interface User {
  id: number;
  telephone: string; 
  password: string;
  role_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
}

export class UserModel {
  id: number;
  telephone: string;
  password: string;
  role_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(
    id: number,
    telephone: string,
    password: string,
    role_id: number,
    is_active: boolean,
    created_at: Date,
    updated_at: Date
  ) {
    this.id = id;
    this.telephone = telephone;
    this.password = password;
    this.role_id = role_id;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export class RoleModel {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  
}
export interface ResetResponse {
  message: string;
}
