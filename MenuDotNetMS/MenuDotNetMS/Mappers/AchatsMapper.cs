using MenuDotNetMS.DTOs.achat;
using MenuDotNetMS.Models;

namespace MenuDotNetMS.Mappers
{
    public class AchatsMapper
    {
        public static Achat ToModel(AchatAddDTORequest dto)
        {
            return new Achat
            {
                DateAchat = DateTime.Now,
                IdArticle = dto.IdArticle,
                IdFournisseur = dto.IdFournisseur,
                QuantiteAchat =dto.QuantiteAchat,
                QuantiteRestante = dto.QuantiteAchat,
                PrixAchatUnitaire =dto.PrixAchatUnitaire,
            };
         }


        public static Achat ToModel(AchatUpdateDTORequest dto)
        {
            return new Achat
            {
                Id = dto.Id,
                DateAchat = dto.DateAchat,
                IdArticle = dto.IdArticle,
                IdFournisseur = dto.IdFournisseur,
                QuantiteAchat = dto.QuantiteAchat,
                QuantiteRestante = dto.QuantiteRestante,
                PrixAchatUnitaire = dto.PrixAchatUnitaire,
            };
        }

        public static AchatAddDTOResponse ToAddDTO(Achat model)
        {
            return new AchatAddDTOResponse
            {
                Id = model.Id,
                DateAchat = model.DateAchat,
                IdArticle = model.IdArticle,
                IdFournisseur = model.IdFournisseur,
                QuantiteAchat = model.QuantiteAchat,
                QuantiteRestante = model.QuantiteRestante,
                PrixAchatUnitaire = model.PrixAchatUnitaire

            };
        }

        public static AchatIndexDTOResponse ToIndexDTO(Achat model) 
        {
            return new AchatIndexDTOResponse
            {
                Id = model.Id,
                DateAchat = model.DateAchat,
                IdArticle = model.IdArticle,
                IdFournisseur = model.IdFournisseur,
                QuantiteAchat = model.QuantiteAchat,
                QuantiteRestante = model.QuantiteRestante,
                PrixAchatUnitaire = model.PrixAchatUnitaire

            };
        
        }

        public static Achat ToModel(QuantiteRestanteUpdateDTORequest dto)
        {
            return new Achat
            {
                Id = dto.Id,
                QuantiteRestante = dto.NouvelleQuantiteRestante
            };//
        }

    }
}
