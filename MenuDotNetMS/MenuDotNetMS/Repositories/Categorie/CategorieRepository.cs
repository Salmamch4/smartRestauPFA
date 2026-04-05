using MenuDotNetMS.Models;
using Microsoft.Data.SqlClient;

namespace MenuDotNetMS.Repositories.categorie
{
    public class CategorieRepository : ICategorieRepository
    {
        private readonly IConfiguration _config;

        public CategorieRepository(IConfiguration config)
        {
            _config = config;
        }

        public bool Add(Categorie categorie)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                if (categorie.Id == Guid.Empty)
                    categorie.Id = Guid.NewGuid();

                string query = "INSERT INTO Categories (id, libelle, Description) VALUES (@Id, @Libelle, @Description)";
                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", categorie.Id);
                    cmd.Parameters.AddWithValue("@Libelle", categorie.Libelle);
                    cmd.Parameters.AddWithValue("@Description", (object?)categorie.Description ?? DBNull.Value);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public List<Categorie> GetAll()
        {
            List<Categorie> list = new List<Categorie>();
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                string query = "SELECT id, libelle, Description FROM Categories";
                using (SqlCommand cmd = new SqlCommand(query, cn))
                using (SqlDataReader rd = cmd.ExecuteReader())
                {
                    while (rd.Read())
                        list.Add(MapToCategorie(rd));
                }
            }
            return list;
        }

        public Categorie GetById(Guid id)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                string query = "SELECT id, libelle, Description FROM Categories WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        if (rd.Read()) return MapToCategorie(rd);
                    }
                }
            }
            return null;
        }

        public bool Update(Categorie categorie)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                string query = "UPDATE Categories SET libelle = @Libelle, Description = @Description WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", categorie.Id);
                    cmd.Parameters.AddWithValue("@Libelle", categorie.Libelle);
                    cmd.Parameters.AddWithValue("@Description", (object?)categorie.Description ?? DBNull.Value);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public bool Delete(Guid id)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                string query = "DELETE FROM Categories WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        private Categorie MapToCategorie(SqlDataReader rd)
        {
            return new Categorie
            {
                Id = rd.GetGuid(rd.GetOrdinal("id")),
                Libelle = rd.GetString(rd.GetOrdinal("libelle")),
                Description = rd.IsDBNull(rd.GetOrdinal("Description")) ? null : rd.GetString(rd.GetOrdinal("Description"))
            };
        }
    }
}