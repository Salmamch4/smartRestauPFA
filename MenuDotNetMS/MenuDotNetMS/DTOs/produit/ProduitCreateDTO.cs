namespace MenuDotNetMS.DTOs.Produit
{
    public class ProduitCreateDTO
    {
        public string Nom { get; set; } = string.Empty;
        public double Prix { get; set; }
        public string? Description { get; set; }
        public Guid IdCategorie { get; set; }
        public IFormFile? ImageFile { get; set; }

        // AJOUTE CETTE LISTE (Utilise exactement ce nom pour le Mapper) :
        public List<ComposantCreateDTO>? Ingrédients { get; set; } = new();
    }

    public class CompositionCreateDTO
    {
        public Guid ArticleId { get; set; }
        public double Quantite { get; set; }
    }
}