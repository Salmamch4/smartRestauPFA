using MenuDotNetMS.models;

namespace MenuDotNetMS.Repositories.article
{
    public interface IArticleRepository
    {
        List<Article> GetAll();

        void Add(Article article);

        void Update(Article article);

        void Delete(Guid id);

        Article GetById(Guid id);
    }
}