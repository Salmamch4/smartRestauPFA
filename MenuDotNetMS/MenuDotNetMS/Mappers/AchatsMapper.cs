using MenuDotNetMS.DTOs.achat;
using MenuDotNetMS.Models;

namespace MenuDotNetMS.Mappers
{
    public static class AchatsMapper
    {
        //  TO MODEL ADD - Multiple articles
        public static List<Achat> ToModelList(AchatAddDTORequest dto)
        {
            var achats = new List<Achat>();

            foreach (var article in dto.Articles)
            {
                achats.Add(new Achat
                {
                    Id = Guid.NewGuid(),
                    DateAchat = dto.DateAchat,
                    IdArticle = article.IdArticle,
                    IdFournisseur = article.IdFournisseur,
                    QuantiteAchat = article.QuantiteAchat,
                    QuantiteRestante = article.QuantiteAchat,
                    PrixAchatUnitaire = article.PrixAchatUnitaire
                });
            }

            return achats;
        }

        // TO MODEL (UPDATE) 
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

        //  TO DTO (RESPONSE) 
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

        // TO MODEL (Quantite Restante) 
        public static Achat ToModel(QuantiteRestanteUpdateDTORequest dto)
        {
            return new Achat
            {
                Id = dto.Id,
                QuantiteRestante = dto.NouvelleQuantiteRestante
            };
        }
    }
}