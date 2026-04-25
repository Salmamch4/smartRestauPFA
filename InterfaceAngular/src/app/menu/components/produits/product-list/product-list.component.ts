import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../../services/produit/produit.service';
import { CategorieService } from '../../../services/categorie/categorie.service';
import { Categorie } from '../../../models/categorie.model';
import { Produit } from '../../../models/produit.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  filterCategorieId: string = '';
  errorMessage: string = '';

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadCategories();
  }

  loadProduits(): void {
    this.produitService.getAll().subscribe({
      next: (data) => { 
        this.produits = data; 
        this.errorMessage = '';
      },
      error: (err) => { 
        console.error('Erreur API:', err);
        this.errorMessage = 'Erreur lors du chargement des produits.'; 
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (data) => { this.categories = data; }
    });
  }

  filteredProduits(): Produit[] {
    if (!this.filterCategorieId) return this.produits;
    return this.produits.filter(p => p.idCategorie === this.filterCategorieId);
  }

  getFinalImagePath(path: string | undefined): string {
    return path ? `https://localhost:7277${path}` : 'assets/no-image.png';
  }

  deleteProduct(id: string): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.delete(id).subscribe({
        next: () => this.loadProduits(),
        error: () => this.errorMessage = 'Erreur lors de la suppression.'
      });
    }
  }

 editProduct(id: string): void {
    // Vérifie que ce chemin correspond bien à celui du router
    this.router.navigate(['/menu/produits/edit', id]);
  }
}