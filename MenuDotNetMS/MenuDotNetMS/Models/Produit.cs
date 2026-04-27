using MenuDotNetMS.Models;

public class Produit
{
    public Guid Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public double Prix { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public Guid IdCategorie { get; set; }
    public DateTime DateCreation { get; set; }

    // Cette propriété doit exister pour le Repository
    public string? CategorieLibelle { get; set; }

    // Utilise "Ingrédients" ici si tu veux garder les accents côté C# 
    // MAIS assure-toi que le Repository utilise le même nom
    public List<CompositionProduit> Ingrédients { get; set; } = new();
}