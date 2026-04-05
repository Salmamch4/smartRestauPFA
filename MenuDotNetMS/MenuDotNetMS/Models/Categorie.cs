namespace MenuDotNetMS.Models
{
    public class Categorie
    {
        public Guid Id { get; set; }
        public string Libelle { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}