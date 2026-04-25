// src/app/models/client.model.ts
export interface Client {
  id: number;
  telephone: string;
  role: string;
  nom?: string;
  email?: string;
}

export interface ClientInfo {
  id: number;
  telephone: string;
  nom: string;
  email: string;
  adresse?: string;
}