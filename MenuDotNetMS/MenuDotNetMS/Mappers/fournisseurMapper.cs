using MenuDotNetMS.DTOs.fournisseur;
using MenuDotNetMS.Models;
using System.Reflection;

namespace MenuDotNetMS.Mappers
{
    public class fournisseurMapper
    {
        public static fournisseurModel ToModel(fournissueurAddDtoRequest dto)
        {
            return new fournisseurModel
            {
                id = Guid.NewGuid().ToString(),
                raison_social = dto.RaisonSocial,
                telephone = dto.Telephone,
                ice = dto.ICE,
                adresse = dto.Adresse,
                date_creation = DateTime.Now
            };
        }
        public static fournisseurModel ToModel(fournissuerUpdateDtoRequest dto)
        {
            return new fournisseurModel
            {
                id = dto.Id,
                raison_social = dto.RaisonSocial,
                telephone = dto.Telephone,
                ice = dto.ICE,
                adresse = dto.Adresse,
                date_creation = DateTime.Now
            };
        }   
        public static fournissuerAddDtoResponse ToAddDto(fournisseurModel model)
        {
            return new fournissuerAddDtoResponse
            {
                Id = model.id,
                RaisonSocial = model.raison_social,
                Telephone = model.telephone,
                ICE = model.ice,
                Adresse = model.adresse,
                DateCreation = model.date_creation
            };
        }

        public static fournisseurIndexDtoResponse ToIndexDto(fournisseurModel model)
        {   
            return new fournisseurIndexDtoResponse
            {
                Id = model.id,
                RaisonSocial = model.raison_social,
                Telephone = model.telephone,
                ICE = model.ice,
                Adresse = model.adresse,
                DateCreation = model.date_creation
            };
        }
        
    }
}
