using MenuDotNetMS.Models;

namespace MenuDotNetMS.Repositories.categorie
{
    public interface ICategorieRepository
    {
        bool Add(Categorie categorie);
        List<Categorie> GetAll();
        Categorie GetById(Guid id);
        bool Update(Categorie categorie);
        bool Delete(Guid id);
    }
}