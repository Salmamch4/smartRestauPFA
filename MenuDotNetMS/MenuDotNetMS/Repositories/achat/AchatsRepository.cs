using MenuDotNetMS.Models;
using Microsoft.Data.SqlClient;

namespace MenuDotNetMS.Repositories.achat
{
    public class AchatsRepository : IAchatsRepository
    {
        IConfiguration config;
        public AchatsRepository(IConfiguration config)
        {
            this.config = config;
        }


        bool Add(Achat achat) 
        { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }
        }
        List<Achat> GetAll() 
        { throw new NotImplementedException();

            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }

        }
        Achat GetById(Guid id) 
        { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }

        }
        bool Update(Achat achat) 
        { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }

        }
        bool Delete(Guid id) { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }
        }
        List<Achat> GetAchatsByArticle(Guid idArticle) { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }

        }
        List<Achat> GetAchatsByFournisseur(Guid idFournisseur) { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }

        }
        bool UpdateQuantiteRestante(Guid id, int nouvelleQuantiteRestante) { throw new NotImplementedException();
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();
            }
        }
    }
}
