// src/app/catalogue/panier.model.ts
export interface PanierItem {
  produitId: string;
  libelle: string;
  prix_unitaire: number;
  quantite: number;
  photo?: string;      // ✅ Ajout de l'image
  imagePath?: string;  // ✅ Alternative
  total: number;
}

export interface Panier {
  items: PanierItem[];
  total: number;
  nombreArticles: number;
}