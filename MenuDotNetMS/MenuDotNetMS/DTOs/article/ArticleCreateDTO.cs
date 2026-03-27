namespace MenuDotNetMS.DTOs.article
{
    public class ArticleCreateDTO
    {
        public string Libelle { get; set; }

        public int QuantiteEnStock { get; set; }

        public int SeuilAlerte { get; set; }
    }
}