import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AchatService } from '../../../services/achat/achat.service';
import { ArticleService } from '../../../services/article/article.service';
import { FournisseurService } from '../../../services/fournisseur/fournisseur.service';
import { Article, Fournisseur, AchatResponse } from '../../../models/achat.model';

@Component({
  selector: 'app-update-achats',
  templateUrl: './update-achats.component.html',
  styleUrls: ['./update-achats.component.css']
})
export class UpdateAchatsComponent implements OnInit {
  updateForm!: FormGroup;
  achatId: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Données
  articles: Article[] = [];
  fournisseurs: Fournisseur[] = [];
  achatOriginal: AchatResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private achatService: AchatService,
    private articleService: ArticleService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

ngOnInit(): void {
    this.achatId = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID de l\'achat à modifier:', this.achatId);
    
    this.initForm();
    this.loadArticles();
    this.loadFournisseurs();
    if (this.achatId) {
      this.loadAchat();
    }
  }

  initForm(): void {
    this.updateForm = this.fb.group({
      id: [''],
      dateAchat: ['', Validators.required],
      idArticle: ['', Validators.required],
      idFournisseur: ['', Validators.required],
      quantiteAchat: [0, [Validators.required, Validators.min(1)]],
      quantiteRestante: [0, [Validators.required, Validators.min(0)]],
      prixAchatUnitaire: [null]
    });
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (err) => {
        console.error('Erreur:', err);
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
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
      }
    });
  }

  loadAchat(): void {
    this.loading = true;
    this.achatService.getById(this.achatId).subscribe({
      next: (data) => {
        this.achatOriginal = data;
        this.updateForm.patchValue({
          id: data.id,
          dateAchat: this.formatDateForInput(data.dateAchat),
          idArticle: data.idArticle,
          idFournisseur: data.idFournisseur,
          quantiteAchat: data.quantiteAchat,
          quantiteRestante: data.quantiteRestante,
          prixAchatUnitaire: data.prixAchatUnitaire
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement de l\'achat';
        this.loading = false;
      }
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  getArticleLibelle(articleId: string): string {
    const article = this.articles.find(a => a.id === articleId);
    return article?.libelle || 'Article inconnu';
  }

  getFournisseurRaisonSocial(fournisseurId: string): string {
    const fournisseur = this.fournisseurs.find(f => f.id === fournisseurId);
    return fournisseur?.raison_social || 'Fournisseur inconnu';
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.updateForm.value;
    const request = {
      id: formValue.id,
      dateAchat: formValue.dateAchat + 'T00:00:00',
      idArticle: formValue.idArticle,
      idFournisseur: formValue.idFournisseur,
      quantiteAchat: formValue.quantiteAchat,
      quantiteRestante: formValue.quantiteRestante,
      prixAchatUnitaire: formValue.prixAchatUnitaire
    };

    console.log('Envoi de la mise à jour:', request);

    this.achatService.update(this.achatId, request).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = '✅ Achat modifié avec succès!';
        setTimeout(() => {
          this.router.navigate(['/achats/list']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur:', err);
        this.errorMessage = err.error?.message || '❌ Erreur lors de la modification';
      }
    });
  }

  canUpdateQuantiteRestante(): boolean {
    if (!this.achatOriginal) return false;
    const newQuantiteRestante = this.updateForm.get('quantiteRestante')?.value;
    const quantiteAchat = this.updateForm.get('quantiteAchat')?.value;
    
    if (newQuantiteRestante > quantiteAchat) {
      return false;
    }
    if (newQuantiteRestante < 0) {
      return false;
    }
    return true;
  }

  goBack(): void {
    this.router.navigate(['/achats/list']);
  }
}