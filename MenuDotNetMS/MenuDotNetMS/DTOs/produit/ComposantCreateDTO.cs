namespace MenuDotNetMS.DTOs.Produit
{
    public class ComposantCreateDTO
    {
        // Changement de int vers Guid pour correspondre à la DB
        public Guid ArticleId { get; set; }
        public double Quantite { get; set; }
    }
}