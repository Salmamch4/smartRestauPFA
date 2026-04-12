namespace MenuDotNetMS.Models
{
    public class CompositionProduit
    {
        public int Id { get; set; } // L'ID de la table de liaison peut rester int (auto-increment)
        public Guid ProduitId { get; set; } // Doit être Guid
        public Guid ArticleId { get; set; } // Doit être Guid
        public double Quantite { get; set; }
        public string? ArticleNom { get; set; }
    }
}