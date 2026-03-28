namespace MenuDotNetMS.DTOs.achat
{
    public class AchatAddDTOResponse
    {
        public Guid Id { get; set; }
        public DateTime DateAchat { get; set; }
        public Guid IdArticle { get; set; }
        public Guid IdFournisseur { get; set; }
        public int QuantiteAchat { get; set; }
        public int QuantiteRestante { get; set; }//
        public decimal? PrixAchatUnitaire { get; set; }//

    }
}
