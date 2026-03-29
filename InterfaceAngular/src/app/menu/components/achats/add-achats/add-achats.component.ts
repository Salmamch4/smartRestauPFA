import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AchatService } from '../../../services/achat/achat.service';
import { ArticleService } from '../../../services/article/article.service';
import { FournisseurService } from '../../../services/fournisseur/fournisseur.service';
import { Article, Fournisseur, ArticleAchat } from '../../../models/achat.model';

@Component({
  selector: 'app-add-achats',
  templateUrl: './add-achats.component.html',
  styleUrls: ['./add-achats.component.css']
})
export class AddAchatsComponent implements OnInit {
  // Champs du formulaire
  selectedArticleId: string = '';
  selectedFournisseurId: string = '';
  quantite: number = 1;
  prixUnitaire: number | null = null;
  
  // Liste des articles ajoutés
  articlesList: any[] = [];
  
  // Données
  articles: Article[] = [];
  fournisseurs: Fournisseur[] = [];
  
  // États
  loading = false;
  errorMessage = '';
  successMessage = '';
  dateAchat: string = new Date().toISOString().split('T')[0];

  constructor(
    private achatService: AchatService,
    private articleService: ArticleService,
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.loadFournisseurs();
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (err) => {
        console.error('Erreur chargement articles:', err);
        this.errorMessage = 'Erreur lors du chargement des articles';
      }
    });
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => {
        console.error('Erreur chargement fournisseurs:', err);
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
      }
    });
  }

  // Récupérer le libellé de l'article
  getArticleLibelle(articleId: string): string {
    const article = this.articles.find(a => a.id === articleId);
    return article?.libelle || 'Article inconnu';
  }

  // Récupérer la raison sociale du fournisseur
  getFournisseurRaisonSocial(fournisseurId: string): string {
    const fournisseur = this.fournisseurs.find(f => f.id === fournisseurId);
    return fournisseur?.raison_social || 'Fournisseur inconnu';
  }

  // Ajouter un article à la liste
  addArticleToList(): void {
    // Vérifier les champs
    if (!this.selectedArticleId) {
      this.errorMessage = 'Veuillez sélectionner un article';
      return;
    }
    
    if (!this.selectedFournisseurId) {
      this.errorMessage = 'Veuillez sélectionner un fournisseur';
      return;
    }
    
    if (!this.quantite || this.quantite < 1) {
      this.errorMessage = 'La quantité doit être supérieure à 0';
      return;
    }
    
    // Vérifier si l'article existe déjà dans la liste
    const articleExiste = this.articlesList.some(a => 
      a.idArticle === this.selectedArticleId && 
      a.idFournisseur === this.selectedFournisseurId
    );
    
    if (articleExiste) {
      this.errorMessage = 'Cet article avec ce fournisseur existe déjà dans la liste';
      return;
    }
    
    // Ajouter à la liste
    this.articlesList.push({
      idArticle: this.selectedArticleId,
      idFournisseur: this.selectedFournisseurId,
      quantiteAchat: this.quantite,
      prixAchatUnitaire: this.prixUnitaire
    });
    
    // Réinitialiser le formulaire
    this.selectedArticleId = '';
    this.selectedFournisseurId = '';
    this.quantite = 1;
    this.prixUnitaire = null;
    
    this.errorMessage = '';
    this.successMessage = '';
    
    // Afficher un message temporaire
    this.successMessage = 'Article ajouté avec succès!';
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }

  // Supprimer un article de la liste
  removeArticle(index: number): void {
    this.articlesList.splice(index, 1);
  }

  // Modifier la quantité d'un article
  updateQuantite(index: number, newQuantite: number): void {
    if (newQuantite > 0) {
      this.articlesList[index].quantiteAchat = newQuantite;
    }
  }

  // Calculer le total de l'achat
  getTotal(): number {
    return this.articlesList.reduce((total, article) => {
      return total + (article.quantiteAchat * (article.prixAchatUnitaire || 0));
    }, 0);
  }

  // Soumettre l'achat
  onSubmit(): void {
    if (this.articlesList.length === 0) {
      this.errorMessage = 'Vous devez ajouter au moins un article';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = {
      dateAchat: this.dateAchat + 'T10:00:00',
      articles: this.articlesList.map(article => ({
        idArticle: article.idArticle,
        idFournisseur: article.idFournisseur,
        quantiteAchat: article.quantiteAchat,
        prixAchatUnitaire: article.prixAchatUnitaire
      }))
    };

    console.log('Envoi de la requête:', request);

    this.achatService.add(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = `✅ Achat enregistré avec succès! ${response.nombreArticles} article(s) ajouté(s).`;
        this.resetForm();
        setTimeout(() => {
          this.router.navigate(['/achats/list']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur:', err);
        this.errorMessage = err.error?.message || '❌ Erreur lors de l\'enregistrement de l\'achat';
      }
    });
  }

  resetForm(): void {
    this.articlesList = [];
    this.selectedArticleId = '';
    this.selectedFournisseurId = '';
    this.quantite = 1;
    this.prixUnitaire = null;
    this.dateAchat = new Date().toISOString().split('T')[0];
    this.errorMessage = '';
    this.successMessage = '';
  }
}