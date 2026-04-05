using MenuDotNetMS.DTOs.categorie;
using MenuDotNetMS.Models;

namespace MenuDotNetMS.Mappers
{
    public static class CategorieMapper
    {
        public static Categorie ToCategorie(CategorieCreateDTO dto)
        {
            return new Categorie
            {
                Id = Guid.NewGuid(),
                Libelle = dto.Libelle,
                Description = dto.Description
            };
        }
    }
}