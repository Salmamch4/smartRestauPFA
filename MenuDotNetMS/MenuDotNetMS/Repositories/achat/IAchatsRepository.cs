using MenuDotNetMS.Models;

namespace MenuDotNetMS.Repositories.achat
{
    public interface IAchatsRepository
    {
        bool Add(Achat achat);
        List<Achat> GetAll();
        Achat GetById(Guid id);
        bool Update(Achat achat);
        bool Delete(Guid id);
        List<Achat> GetAchatsByArticle(Guid idArticle);
        List<Achat> GetAchatsByFournisseur(Guid idFournisseur);
        bool UpdateQuantiteRestante(Achat achat);
    }
}
