import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { 
  AchatRequest, 
  AchatResponse, 
  QuantiteRestanteUpdate,
  AchatUpdateRequest,
  Article,
  Fournisseur
} from '../../models/achat.model';
import { ArticleService } from '../article/article.service';
import { FournisseurService } from '../fournisseur/fournisseur.service';

@Injectable({
  providedIn: 'root'
})
export class AchatService {
  private apiUrl = 'http://localhost:5000/api/Achats';

  constructor(
    private http: HttpClient,
    private articleService: ArticleService,
    private fournisseurService: FournisseurService
  ) {}

  add(achat: AchatRequest): Observable<any> {
    return this.http.post(this.apiUrl, achat);
  }

  // Récupérer tous les achats avec les noms des articles et fournisseurs
  getAll(): Observable<AchatResponse[]> {
    return forkJoin({
      achats: this.http.get<AchatResponse[]>(this.apiUrl),
      articles: this.articleService.getAll(),
      fournisseurs: this.fournisseurService.getAll()
    }).pipe(
      map(result => {
        return result.achats.map(achat => ({
          ...achat,
          articleLibelle: result.articles.find(a => a.id === achat.idArticle)?.libelle || 'Article inconnu',
          fournisseurRaisonSocial: result.fournisseurs.find(f => f.id === achat.idFournisseur)?.raisonSociale || 'Fournisseur inconnu'
        }));
      })
    );
  }

  // ✅ Récupérer un achat par ID avec les noms
  getById(id: string): Observable<AchatResponse> {
    return forkJoin({
      achat: this.http.get<AchatResponse>(`${this.apiUrl}/${id}`),
      articles: this.articleService.getAll(),
      fournisseurs: this.fournisseurService.getAll()
    }).pipe(
      map(result => ({
        ...result.achat,
        articleLibelle: result.articles.find(a => a.id === result.achat.idArticle)?.libelle || 'Article inconnu',
        fournisseurRaisonSocial: result.fournisseurs.find(f => f.id === result.achat.idFournisseur)?.raisonSociale || 'Fournisseur inconnu'
      }))
    );
  }

  getByArticle(articleId: string): Observable<AchatResponse[]> {
    return this.http.get<AchatResponse[]>(`${this.apiUrl}/article/${articleId}`);
  }

  getByFournisseur(fournisseurId: string): Observable<AchatResponse[]> {
    return this.http.get<AchatResponse[]>(`${this.apiUrl}/fournisseur/${fournisseurId}`);
  }

  update(id: string, achat: AchatUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, achat);
  }

  updateQuantiteRestante(id: string, data: QuantiteRestanteUpdate): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/quantite-restante`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}