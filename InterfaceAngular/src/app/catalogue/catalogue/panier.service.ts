// src/app/services/panier/panier.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanierItem, Panier } from '../catalogue/panier.model';
import { Produit } from '../catalogue/produit.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private readonly STORAGE_KEY = 'panier';
  private panierSubject = new BehaviorSubject<Panier>({ items: [], total: 0, nombreArticles: 0 });

  constructor() {
    this.loadPanier();
  }

  private loadPanier(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const panier = JSON.parse(saved);
      this.panierSubject.next(panier);
    }
  }

  private savePanier(panier: Panier): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(panier));
    this.panierSubject.next(panier);
  }

  getPanier(): Observable<Panier> {
    return this.panierSubject.asObservable();
  }

  getCurrentPanier(): Panier {
    return this.panierSubject.value;
  }

  ajouterProduit(produit: Produit, quantite: number = 1): void {
    const panier = this.getCurrentPanier();
    const existingItem = panier.items.find(item => item.produitId === produit.id);

    if (existingItem) {
      existingItem.quantite += quantite;
      existingItem.total = existingItem.quantite * existingItem.prix_unitaire;
    } else {
      panier.items.push({
        produitId: produit.id,
        libelle: produit.libelle,
        prix_unitaire: produit.prix_unitaire,
        quantite: quantite,
        photo: produit.photo,
        total: quantite * produit.prix_unitaire
      });
    }

    this.calculerTotaux(panier);
    this.savePanier(panier);
  }

  retirerProduit(produitId: string): void {
    const panier = this.getCurrentPanier();
    const index = panier.items.findIndex(item => item.produitId === produitId);
    
    if (index !== -1) {
      if (panier.items[index].quantite > 1) {
        panier.items[index].quantite--;
        panier.items[index].total = panier.items[index].quantite * panier.items[index].prix_unitaire;
      } else {
        panier.items.splice(index, 1);
      }
      this.calculerTotaux(panier);
      this.savePanier(panier);
    }
  }

  supprimerProduit(produitId: string): void {
    const panier = this.getCurrentPanier();
    panier.items = panier.items.filter(item => item.produitId !== produitId);
    this.calculerTotaux(panier);
    this.savePanier(panier);
  }

  viderPanier(): void {
    this.savePanier({ items: [], total: 0, nombreArticles: 0 });
  }

  private calculerTotaux(panier: Panier): void {
    panier.nombreArticles = panier.items.reduce((sum, item) => sum + item.quantite, 0);
    panier.total = panier.items.reduce((sum, item) => sum + item.total, 0);
  }
}