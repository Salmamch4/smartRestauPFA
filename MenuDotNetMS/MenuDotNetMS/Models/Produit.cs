namespace MenuDotNetMS.Models
{
    public class Produit
    {
        public Guid Id { get; set; }
        public string Photo { get; set; }
        public string Libelle { get; set; }
        public decimal PrixUnitaire { get; set; }
        public Guid IdCategorie { get; set; }
        public string Description { get; set; }
        public DateTime DateCreation { get; set; }
    }
}