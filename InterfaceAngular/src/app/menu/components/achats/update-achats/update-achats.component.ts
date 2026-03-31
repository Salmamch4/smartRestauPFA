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
  
  // Field errors (comme dans Login)
  fieldErrors: { dateAchat?: string; article?: string; fournisseur?: string; quantiteAchat?: string; quantiteRestante?: string } = {};

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
    
    // Clear field errors when user types
    this.updateForm.valueChanges.subscribe(() => {
      this.fieldErrors = {};
      this.errorMessage = '';
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

  // Validation en temps réel
  validateQuantiteRestante(): void {
    const quantiteAchat = this.updateForm.get('quantiteAchat')?.value;
    const quantiteRestante = this.updateForm.get('quantiteRestante')?.value;
    
    if (quantiteRestante > quantiteAchat) {
      this.fieldErrors.quantiteRestante = 'La quantité restante ne peut pas dépasser la quantité achetée';
    } else if (quantiteRestante < 0) {
      this.fieldErrors.quantiteRestante = 'La quantité restante ne peut pas être négative';
    } else {
      this.fieldErrors.quantiteRestante = '';
    }
  }

  onSubmit(): void {
    // Reset errors
    this.fieldErrors = {};
    this.errorMessage = '';
    
    // Validate form
    if (this.updateForm.invalid) {
      if (this.updateForm.get('dateAchat')?.invalid) {
        this.fieldErrors.dateAchat = 'La date d\'achat est requise';
      }
      if (this.updateForm.get('idArticle')?.invalid) {
        this.fieldErrors.article = 'Veuillez sélectionner un article';
      }
      if (this.updateForm.get('idFournisseur')?.invalid) {
        this.fieldErrors.fournisseur = 'Veuillez sélectionner un fournisseur';
      }
      if (this.updateForm.get('quantiteAchat')?.invalid) {
        this.fieldErrors.quantiteAchat = 'La quantité doit être positive';
      }
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    
    // Validate quantity logic
    this.validateQuantiteRestante();
    if (this.fieldErrors.quantiteRestante) {
      this.errorMessage = this.fieldErrors.quantiteRestante;
      return;
    }

    this.loading = true;
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
        // ✅ Redirection vers la liste après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/list-achats']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur:', err);
        
        // Gestion des erreurs comme dans Login
        if (err.status === 400) {
          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.error?.errors) {
            if (err.error.errors.idArticle) {
              this.fieldErrors.article = err.error.errors.idArticle[0];
            }
            if (err.error.errors.idFournisseur) {
              this.fieldErrors.fournisseur = err.error.errors.idFournisseur[0];
            }
            if (err.error.errors.quantiteAchat) {
              this.fieldErrors.quantiteAchat = err.error.errors.quantiteAchat[0];
            }
            this.errorMessage = 'Erreur de validation';
          } else {
            this.errorMessage = 'Données invalides';
          }
        } else if (err.status === 404) {
          this.errorMessage = 'Achat non trouvé';
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur serveur. Réessayez plus tard.';
        } else {
          this.errorMessage = err.error?.message || '❌ Erreur lors de la modification';
        }
      }
    });
  }

  canUpdateQuantiteRestante(): boolean {
    if (!this.achatOriginal) return true;
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

  // Méthode pour revenir à la liste sans sauvegarder
  goBack(): void {
    this.router.navigate(['/list-achats']);
  }
}