import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../../services/produit/produit.service';
import { CategorieService } from '../../../services/categorie/categorie.service';
import { ArticleService } from '../../../services/article/article.service';
import { Categorie } from '../../../models/categorie.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  produitForm!: FormGroup;
  categories: Categorie[] = [];
  articles: any[] = [];
  compositionList: any[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  productId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router, // Mis en PUBLIC pour le HTML
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadCategories();
    this.loadArticles();
    this.loadProductData();
  }

  initForm() {
    this.produitForm = this.fb.group({
      nom: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0.1)]],
      description: [''],
      idCategorie: ['', Validators.required],
      articleId: [''],
      quantite: [1]
    });
  }

  loadProductData() {
    this.produitService.getById(this.productId).subscribe({
      next: (prod) => {
        this.produitForm.patchValue({
          nom: prod.nom,
          prix: prod.prix,
          description: prod.description,
          idCategorie: prod.idCategorie
        });
        this.compositionList = prod.ingredients || [];
        if (prod.imagePath) {
          this.imagePreview = `https://localhost:7277${prod.imagePath}`;
        }
      }
    });
  }

  loadCategories() {
    this.categorieService.getAll().subscribe(data => this.categories = data);
  }

  loadArticles() {
    this.articleService.getAll().subscribe(data => this.articles = data);
  }

  addIngredient() {
    const artId = this.produitForm.value.articleId;
    const qty = this.produitForm.value.quantite;
    const article = this.articles.find(a => a.id === artId);
    if (article && qty > 0) {
      this.compositionList.push({ idArticle: artId, quantite: qty, libelle: article.designation });
    }
  }

  removeIngredient(index: number) { this.compositionList.splice(index, 1); }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('Nom', this.produitForm.value.nom);
    formData.append('Prix', this.produitForm.value.prix.toString());
    formData.append('Description', this.produitForm.value.description || '');
    formData.append('IdCategorie', this.produitForm.value.idCategorie);
    if (this.selectedFile) formData.append('ImageFile', this.selectedFile);

    // Transformation pour correspondre au backend (idArticle -> articleId)
    const ingredients = this.compositionList.map(i => ({ articleId: i.idArticle, quantite: i.quantite }));
    formData.append('ComposantsJson', JSON.stringify(ingredients));

    this.produitService.update(this.productId, formData).subscribe(() => {
      this.router.navigate(['/list-produits']);
    });
  }
}