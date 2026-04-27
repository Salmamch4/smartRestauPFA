using MenuDotNetMS.DTOs.Produit;
using MenuDotNetMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MenuDotNetMS.Mappers
{
    public static class ProduitMapper
    {
        public static Produit ToProduit(ProduitCreateDTO dto)
        {
            return new Produit
            {
                Nom = dto.Nom,
                Prix = dto.Prix,
                Description = dto.Description,
                IdCategorie = dto.IdCategorie,
                Ingrédients = dto.Ingrédients?.Select(i => new CompositionProduit
                {
                    ArticleId = i.ArticleId,
                    Quantite = i.Quantite
                }).ToList() ?? new List<CompositionProduit>()
            };
        }

        public static ProduitResponseDTO ToResponseDTO(Produit produit)
        {
            return new ProduitResponseDTO
            {
                Id = produit.Id,
                Nom = produit.Nom,
                Prix = produit.Prix,
                Description = produit.Description,
                ImagePath = produit.ImagePath,
                IdCategorie = produit.IdCategorie,
                CategorieLibelle = produit.CategorieLibelle,
                Ingrédients = produit.Ingrédients?.Select(i => new CompositionProduitResponseDTO
                {
                    ArticleId = i.ArticleId,
                    ArticleNom = i.ArticleNom, // Le nom récupéré par la jointure SQL
                    Quantite = i.Quantite
                }).ToList() ?? new List<CompositionProduitResponseDTO>()
            };
        }
    }
}