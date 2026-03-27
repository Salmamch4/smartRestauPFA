namespace MenuDotNetMS.DTOs.article
{
    public class ArticleResponseDTO
    {
        public Guid Id { get; set; }

        public string Libelle { get; set; }

        public int QuantiteEnStock { get; set; }

        public int SeuilAlerte { get; set; }
    }
}