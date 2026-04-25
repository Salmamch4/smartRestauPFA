export interface PanierItem {
  produitId: string;
  libelle: string;
  prix_unitaire: number;
  quantite: number;
  photo: string;
  total: number;
}

export interface Panier {
  items: PanierItem[];
  total: number;
  nombreArticles: number;
}