using MenuDotNetMS.DTOs.article;
using MenuDotNetMS.models;

public static class ArticleMapper
{
    public static Article ToArticle(ArticleCreateDTO dto)
    {
        return new Article
        {
            Id = Guid.NewGuid(),
            Libelle = dto.Libelle,
            QuantiteEnStock = dto.QuantiteEnStock,
            SeuilAlerte = dto.SeuilAlerte,
            DateCreation = DateTime.Now
        };
    }
}