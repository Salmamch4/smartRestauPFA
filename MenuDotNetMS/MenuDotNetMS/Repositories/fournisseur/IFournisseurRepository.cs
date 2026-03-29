using MenuDotNetMS.Models;

namespace MenuDotNetMS.Repositories.fournisseur
{
    public interface IFournisseurRepository
    {
        bool Add(fournisseurModel fr);
        List<fournisseurModel> GetAll();
        fournisseurModel GetByICE(string ice);
        fournisseurModel GetById(string id);
        //List<fournisseurModel> Search(string keyword);
        //int GetCount();
        bool Update(string id, fournisseurModel fr);
        bool Delete(string id);
    }
}
