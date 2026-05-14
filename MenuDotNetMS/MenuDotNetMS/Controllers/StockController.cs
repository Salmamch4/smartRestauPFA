// Controllers/StockController.cs
using MenuDotNetMS.DTOs.stock;
using MenuDotNetMS.Repositories.achat;
using MenuDotNetMS.Repositories.article;
using MenuDotNetMS.Repositories.produit;
using MenuDotNetMS.Models;
using Microsoft.AspNetCore.Mvc;

namespace MenuDotNetMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IAchatsRepository _achatRepository;
        private readonly IProduitRepository _produitRepository; // ✅ Ajouté

        public StockController(
            IArticleRepository articleRepository,
            IAchatsRepository achatRepository,
            IProduitRepository produitRepository)  // ✅ Ajouté
        {
            _articleRepository = articleRepository;
            _achatRepository = achatRepository;
            _produitRepository = produitRepository;
        }

        [HttpPost("deduct")]
        public IActionResult DeductStock([FromBody] List<StockDeductionRequest> requests)
        {
            Console.WriteLine("=== STOCK DEDUCTION CALLED ===");
            Console.WriteLine($"Nombre d'articles (produits): {requests.Count}");

            try
            {
                foreach (var request in requests)
                {
                    Console.WriteLine($"Traitement produit: {request.ProductName} - Quantité: {request.Quantity}");

                    // ✅ Récupérer le produit avec ses ingrédients (compositions)
                    var produit = _produitRepository.GetById(Guid.Parse(request.ProductId));
                    if (produit == null)
                    {
                        return BadRequest(new { message = $"Produit {request.ProductName} non trouvé" });
                    }

                    if (produit.Ingrédients == null || !produit.Ingrédients.Any())
                    {
                        Console.WriteLine($"⚠️ Produit {request.ProductName} n'a pas d'ingrédients définis");
                        continue;
                    }

                    // ✅ Pour chaque ingrédient du produit, déduire du stock
                    foreach (var ingredient in produit.Ingrédients)
                    {
                        var article = _articleRepository.GetById(ingredient.ArticleId);
                        if (article == null)
                        {
                            return BadRequest(new { message = $"Ingrédient non trouvé pour {request.ProductName}" });
                        }

                        int quantiteNecessaire = (int)(ingredient.Quantite * request.Quantity);

                        if (article.QuantiteEnStock < quantiteNecessaire)
                        {
                            return BadRequest(new { message = $"Stock insuffisant pour {article.Libelle}. Nécessaire: {quantiteNecessaire}, Stock: {article.QuantiteEnStock}" });
                        }

                        // Déduire du stock
                        article.QuantiteEnStock -= quantiteNecessaire;
                        _articleRepository.Update(article);

                        Console.WriteLine($"   ✅ {article.Libelle}: {quantiteNecessaire} unités déduites (stock: {article.QuantiteEnStock})");

                        // ✅ Mettre à jour Quantite_Restante dans Achats
                        UpdateQuantiteRestanteInAchats(ingredient.ArticleId, quantiteNecessaire);
                    }
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erreur: {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private void UpdateQuantiteRestanteInAchats(Guid articleId, int quantiteUtilisee)
        {
            var achats = _achatRepository.GetAchatsByArticle(articleId);
            achats = achats.OrderBy(a => a.DateAchat).ToList();

            int quantiteRestanteADeduire = quantiteUtilisee;

            foreach (var achat in achats)
            {
                if (quantiteRestanteADeduire <= 0) break;

                if (achat.QuantiteRestante > 0)
                {
                    int deduction = Math.Min(quantiteRestanteADeduire, achat.QuantiteRestante);
                    achat.QuantiteRestante -= deduction;
                    quantiteRestanteADeduire -= deduction;
                    _achatRepository.UpdateQuantiteRestante(achat);
                    Console.WriteLine($"      📦 Achat {achat.Id}: QuantiteRestante = {achat.QuantiteRestante}");
                }
            }
        }
    }
}