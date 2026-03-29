namespace MenuDotNetMS.DTOs.achat
{
    public class AchatAddDTORequest
    {
        public DateTime DateAchat { get; set; }
        public List<AchatArticleDTO> Articles { get; set; } = new List<AchatArticleDTO>();
    }

    public class AchatArticleDTO
    {
        public Guid IdArticle { get; set; }
        public Guid IdFournisseur { get; set; }
        public int QuantiteAchat { get; set; }
        public decimal? PrixAchatUnitaire { get; set; }
    }
}