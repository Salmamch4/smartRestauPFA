export interface Fournisseur {
  id: string;
  ice: string;
  raisonSocial: string;  // Note: PascalCase comme la réponse
  telephone: string;
  adresse: string;
  dateCreation: Date;
}

export interface FournissueurAddDtoRequest {
  ice: string;
  raisonSocial: string;  
  telephone: string;
  adresse: string;
}

export interface FournissuerUpdateDtoRequest {
  ice?: string;
  raisonSocial?: string;
  telephone?: string;
  adresse?: string;
}