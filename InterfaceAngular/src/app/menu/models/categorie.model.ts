export interface Categorie {
  id: string;
  libelle: string;
  description?: string;
}

export interface CategorieCreate {
  libelle: string;
  description?: string;
}