// src/app/order/models/order.model.ts
export interface OrderItem {
    id: string;
    produitId: string;
    produitLibelle: string;
    quantite: number;
    prixUnitaire: number;
    totalLigne: number;
    disponible?: boolean;
    stockDisponible?: number;
    seuilAlerte?: number;
    stockMessage?: string;
}

export interface Order {
    id: string;
    numeroCommande: string;
    nomClient: string;
    telephone: string;
    numeroTable: number;
    statut: string;
    total: number;
    dateCommande: string;
    items: OrderItem[];
}