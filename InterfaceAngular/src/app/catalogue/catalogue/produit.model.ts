// src/app/catalogue/produit.model.ts
export interface Produit {
  id: string;
  libelle: string;
  nom?: string;
  description: string;
  prix_unitaire: number;
  prix?: number;
  photo: string;
  imagePath?: string;
  id_categorie: string;
  dateCreation: string;
}