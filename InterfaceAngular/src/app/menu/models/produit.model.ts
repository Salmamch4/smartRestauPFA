export interface Produit {
  id: string;
  nom: string;
  prix: number;
  description?: string;
  imagePath?: string;
  idCategorie: string;
  categorieLibelle?: string;
  // Utilisation du nom sans accent pour la compatibilité Angular
  ingredients?: Composant[]; 
}

export interface Composant {
  articleId: string;
  quantite: number;
  articleNom?: string;
}