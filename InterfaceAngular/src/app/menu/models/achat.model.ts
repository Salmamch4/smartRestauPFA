// Pour l'ajout d'un achat (plusieurs articles)
export interface ArticleAchat {
  idArticle: string;
  idFournisseur: string;
  quantiteAchat: number;
  prixAchatUnitaire: number | null;
}

export interface AchatRequest {
  dateAchat: string;
  articles: ArticleAchat[];
}

// Pour la réponse (liste et détails)
// Pour la réponse (liste et détails)
export interface AchatResponse {
  id: string;
  dateAchat: string;
  idArticle: string;
  articleLibelle: string;              // ✅ Ajouté
  idFournisseur: string;
  fournisseurRaisonSocial: string;     // ✅ Ajouté
  fournisseurICE?: string;             // Optionnel
  fournisseurTelephone?: string;       // Optionnel
  quantiteAchat: number;
  quantiteRestante: number;
  prixAchatUnitaire: number | null;
}

// Pour la mise à jour de la quantité restante
export interface QuantiteRestanteUpdate {
  id: string;
  nouvelleQuantiteRestante: number;
}

// Pour la mise à jour complète d'un achat
export interface AchatUpdateRequest {
  id: string;
  dateAchat: string;
  idArticle: string;
  idFournisseur: string;
  quantiteAchat: number;
  quantiteRestante: number;
  prixAchatUnitaire: number | null;
}

export interface Article {
  id: string;
  libelle: string;
  quantiteEnStock: number;
  seuilAlerte: number;
  dateCreation: string;
}

export interface Fournisseur {
  id: string;
  raison_social: string;      
  telephone: string;
  ice: string;
  adresse: string;
  date_creation: string;      
}


