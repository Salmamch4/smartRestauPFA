namespace MenuDotNetMS.DTOs.Produit
{
    public class ProduitResponseDTO
    {
        public Guid Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public double Prix { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public Guid IdCategorie { get; set; }
        public string? CategorieLibelle { get; set; }

        // AJOUTE CETTE LISTE :
        public List<CompositionProduitResponseDTO> Ingrédients { get; set; } = new();
    }

    public class CompositionProduitResponseDTO
    {
        public Guid ArticleId { get; set; }
        public string? ArticleNom { get; set; }
        public double Quantite { get; set; }
    }
}