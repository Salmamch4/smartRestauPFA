import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../../services/produit/produit.service';
import { ArticleService } from '../../../services/article/article.service';
import { CategorieService } from '../../../services/categorie/categorie.service';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.css']
})
export class AddProduitComponent implements OnInit {
  nom: string = '';
  prixProduit: number | null = null;
  description: string = '';
  selectedCategorieId: string = '';
  selectedArticleId: string = ''; 
  quantiteComposant: number = 1;
  
  articles: any[] = [];
  categories: any[] = [];
  composantsList: any[] = [];
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  errorMessage: string = ''; 

  constructor(
    private produitService: ProduitService,
    private articleService: ArticleService,
    private categorieService: CategorieService,
    public router: Router 
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe(data => this.articles = data);
    this.categorieService.getAll().subscribe(data => this.categories = data);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  addComposantToList(): void {
    if (!this.selectedArticleId || this.quantiteComposant <= 0) return;
    const art = this.articles.find(a => a.id === this.selectedArticleId);
    this.composantsList.push({
      articleId: this.selectedArticleId,
      quantite: this.quantiteComposant,
      libelle: art ? art.libelle : 'Article'
    });
    this.selectedArticleId = '';
    this.quantiteComposant = 1;
  }

  removeComposant(index: number): void {
    this.composantsList.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.nom || !this.selectedCategorieId) {
        this.errorMessage = "Nom et catégorie requis.";
        return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('Nom', this.nom);
    formData.append('Prix', this.prixProduit?.toString() || '0');
    formData.append('Description', this.description);
    formData.append('IdCategorie', this.selectedCategorieId);
    
    if (this.selectedFile) formData.append('ImageFile', this.selectedFile);
    
    // Format JSON pour le contrôleur
    const payload = this.composantsList.map(c => ({ 
        articleId: c.articleId, 
        quantite: c.quantite 
    }));
    formData.append('ComposantsJson', JSON.stringify(payload));

    this.produitService.add(formData).subscribe({
      next: () => this.router.navigate(['/menu/produits/list']),
      error: (err) => {
        this.errorMessage = "Erreur d'enregistrement.";
        this.loading = false;
      }
    });
  }
}