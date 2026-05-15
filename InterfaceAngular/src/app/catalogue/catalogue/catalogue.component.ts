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

  // ✅ Image par défaut
  defaultImage = 'assets/img/default-product.png';
  
  // URLs des images par défaut par catégorie
  private defaultCategoryImages: { [key: string]: string } = {
    'Entrée': 'assets/img/entree-default.jpg',
    'Plat principal': 'assets/img/plat-default.jpg',
    'Salade': 'assets/img/salade-default.jpg',
    'Dessert': 'assets/img/dessert-default.jpg',
    'boison': 'assets/img/boisson-default.jpg'
  };

  private categoryOrder: string[] = ['Entrée', 'Plat principal', 'Salade', 'Dessert', 'boison'];

  private categoryImages: { [key: string]: string } = {
    'Entrée': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop',
    'Plat principal': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?w=400&h=300&fit=crop',
    'Dessert': 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?w=400&h=300&fit=crop',
    'boison': 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?w=400&h=300&fit=crop',
    'Salade': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop'
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
    
    this.subscriptions.add(
      this.authStateService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      })
    );
    
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
        this.categories = data.sort((a, b) => {
          return this.categoryOrder.indexOf(a.libelle) - this.categoryOrder.indexOf(b.libelle);
        });
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

 // Dans loadProduits, ajouter un log
// catalogue.component.ts - Modifier loadProduits
loadProduits(categorieId: string): void {
  this.loadingProduits = true;
  this.produitService.getByCategorie(categorieId).subscribe({
    next: (data) => {
      console.log('Produits bruts:', data);
      
      // ✅ S'assurer que chaque produit a un prix
      this.produits = data.map(produit => ({
        ...produit,
        // Si prix_unitaire est undefined, utiliser prix
        prix_unitaire: produit.prix_unitaire || produit.prix || 0,
        libelle: produit.libelle || produit.nom
      }));
      
      console.log('Produits après correction:', this.produits);
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

  // ✅ Fonction améliorée pour récupérer l'image du produit
  getProductImage(produit: any): string {
    // 1. Vérifier si le produit a une image
    if (produit.photo && produit.photo !== '' && produit.photo !== 'null') {
      // Si l'image est un chemin relatif (commence par /images/)
      if (produit.photo.startsWith('/images/')) {
        return `https://localhost:7277${produit.photo}`;
      }
      // Si l'image est une URL complète
      if (produit.photo.startsWith('http')) {
        return produit.photo;
      }
      return produit.photo;
    }
    
    // 2. Vérifier imagePath
    if (produit.imagePath && produit.imagePath !== '' && produit.imagePath !== 'null') {
      if (produit.imagePath.startsWith('/images/')) {
        return `https://localhost:7277${produit.imagePath}`;
      }
      return produit.imagePath;
    }
    
    // 3. Image par défaut selon la catégorie
    if (this.selectedCategory) {
      const defaultCatImage = this.defaultCategoryImages[this.selectedCategory.libelle];
      if (defaultCatImage) {
        return defaultCatImage;
      }
    }
    
    // 4. Image par défaut absolue
    return this.defaultImage;
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  // Dans catalogue.component.ts - Modifier la méthode ajouterAuPanier

ajouterAuPanier(produit: any): void {
  // ✅ S'assurer que l'image est bien transmise
  const produitAvecImage = {
    ...produit,
    photo: this.getProductImage(produit)
  };
  this.panierService.ajouterProduit(produitAvecImage, 1);
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
    if (this.selectedCategory?.id === categoryId) {
      return this.produits.length;
    }
    return 0;
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

  // catalogue.component.ts
goToMesCommandes(): void {
  this.router.navigate(['/mes-commandes']);
}
}