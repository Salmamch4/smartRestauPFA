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
export interface AchatResponse {
  id: string;
  dateAchat: string;
  idArticle: string;
  articleLibelle: string;              
  idFournisseur: string;
  fournisseurRaisonSocial: string;     
  fournisseurICE?: string;             
  fournisseurTelephone?: string;       
  quantiteAchat: number;
  quantiteRestante: number;
  prixAchatUnitaire: number | null;
}

export interface QuantiteRestanteUpdate {
  id: string;
  nouvelleQuantiteRestante: number;
}

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


