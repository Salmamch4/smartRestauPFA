// src/app/catalogue/catalogue/catalogue.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PanierService } from './panier.service';
import { CategorieService } from '../../menu/services/categorie/categorie.service';
import { ProduitService } from '../catalogue/produit.service';
import { AuthServiceService } from '../../auth/core/services/auth-service.service';
import { AuthStateService } from '../../auth/core/services/auth-state.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  produits: any[] = [];
  selectedCategory: any = null;
  panier: any = { items: [], total: 0, nombreArticles: 0 };
  showPanier: boolean = false;
  loadingCategories = false;
  loadingProduits = false;
  errorMessage = '';
  
  // Authentification
  isLoggedIn = false;
  currentUser: any = null;
  private subscriptions: Subscription = new Subscription();

  defaultImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop';

  private categoryImages: { [key: string]: string } = {
    'Entrée': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop',
    'Plat principal': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?w=400&h=300&fit=crop',
    'Dessert': 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?w=400&h=300&fit=crop',
    'boison': 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?w=400&h=300&fit=crop'
  };

  constructor(
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private panierService: PanierService,
    private authStateService: AuthStateService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.panierService.getPanier().subscribe(panier => {
      this.panier = panier;
    });
    
    // ✅ S'abonner aux changements d'authentification
    this.subscriptions.add(
      this.authStateService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      })
    );
    
    // ✅ S'abonner aux changements de l'utilisateur
    this.subscriptions.add(
      this.authStateService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categorieService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des catégories';
        this.loadingCategories = false;
      }
    });
  }

  selectCategory(category: any): void {
    this.selectedCategory = category;
    this.loadProduits(category.id);
  }

  loadProduits(categorieId: string): void {
    this.loadingProduits = true;
    this.produitService.getByCategorie(categorieId).subscribe({
      next: (data) => {
        this.produits = data;
        this.loadingProduits = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.loadingProduits = false;
      }
    });
  }

  getCategoryImage(category: any): string {
    return this.categoryImages[category.libelle] || this.defaultImage;
  }

  getProductImage(produit: any): string {
    return produit.photo || this.defaultImage;
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  ajouterAuPanier(produit: any): void {
    this.panierService.ajouterProduit(produit, 1);
  }

  retirerDuPanier(produitId: string): void {
    this.panierService.retirerProduit(produitId);
  }

  supprimerDuPanier(produitId: string): void {
    this.panierService.supprimerProduit(produitId);
  }

  viderPanier(): void {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      this.panierService.viderPanier();
    }
  }

  togglePanier(): void {
    this.showPanier = !this.showPanier;
  }

  getProductCountByCategory(categoryId: string): number {
    return this.produits.length;
  }

  validerCommande(): void {
    const panier = this.panierService.getCurrentPanier();
    if (panier.items.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    this.router.navigate(['/commande']);
  }

  logout(): void {
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToMesCommandes(): void {
    this.router.navigate(['/mes-commandes']);
  }
}