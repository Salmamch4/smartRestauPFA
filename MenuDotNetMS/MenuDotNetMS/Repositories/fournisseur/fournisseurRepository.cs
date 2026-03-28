using MenuDotNetMS.Models;
using System.Data.SqlClient;
namespace MenuDotNetMS.Repositories.fournisseur
{
    public class fournisseurRepository : IFournisseurRepository
    {
        IConfiguration config;
        private readonly string ConnString;
        public fournisseurRepository(IConfiguration config)
        {
            this.config = config;
            ConnString = config.GetConnectionString("DefaultConnection");
        }
        public bool Add(fournisseurModel fr)
        {
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                if (string.IsNullOrEmpty(fr.id))
                {
                    fr.id = Guid.NewGuid().ToString();
                }
                string query = "INSERT INTO Fournisseurs (id, raison_social, telephone, ice, adresse, DateCreation)" +
                               "VALUES (@id, @raison_social, @telephone, @ice, @adresse, @DateCreation)";

                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", fr.id);
                    command.Parameters.AddWithValue("@raison_social", fr.raison_social);
                    command.Parameters.AddWithValue("@telephone", fr.telephone);
                    command.Parameters.AddWithValue("@ice", fr.ice);
                    command.Parameters.AddWithValue("@adresse", fr.adresse);
                    command.Parameters.AddWithValue("@DateCreation", fr.date_creation);
                    int Results = command.ExecuteNonQuery();
                    return Results > 0;
                }
            }
        }

        public List<fournisseurModel> GetAll()
        {
            var fournisseurs = new List<fournisseurModel>();
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                string query = "SELECT * FROM Fournisseurs";
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            fournisseurs.Add(new fournisseurModel
                            {
                                id = reader["id"].ToString(),
                                raison_social = reader["raison_social"] != DBNull.Value ? reader["raison_social"].ToString() : null,
                                telephone = reader["telephone"].ToString(),
                                ice = reader["ice"].ToString(),
                                adresse = reader["adresse"] != DBNull.Value ? reader["adresse"].ToString() : null,
                                date_creation = Convert.ToDateTime(reader["DateCreation"])

                            });
                        }
                    }
                }
            }
            return fournisseurs;
        }

        public fournisseurModel GetByICE(string ice)
        {
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                string query = "SELECT * FROM Fournisseurs WHERE ice=@ice";
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new fournisseurModel
                            {
                                id = reader["id"].ToString(),
                                raison_social = reader["raison_social"] != DBNull.Value ? reader["raison_social"].ToString() : null,
                                telephone = reader["telephone"].ToString(),
                                ice = reader["ice"].ToString(),
                                adresse = reader["adresse"] != DBNull.Value ? reader["adresse"].ToString() : null,
                                date_creation = Convert.ToDateTime(reader["DateCreation"])

                            };
                        }
                    }
                }
            }
            return null;
        }

        public fournisseurModel GetById(string id)
        {
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                string query = @"SELECT * FROM Fournisseurs WHERE id=@id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new fournisseurModel
                            {
                                id = reader["id"].ToString(),
                                raison_social = reader["raison_social"] != DBNull.Value ? reader["raison_social"].ToString() : null,
                                telephone = reader["telephone"].ToString(),
                                ice = reader["ice"].ToString(),
                                adresse = reader["adresse"] != DBNull.Value ? reader["adresse"].ToString() : null,
                                date_creation = Convert.ToDateTime(reader["DateCreation"])

                            };
                        }


                    }
                }
            }
            return null;
        }

        public bool Update(string id, fournisseurModel fr)
        {
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                string query = @"UPDATE Fournisseurs 
                        SET raison_social = @raison_social, 
                            telephone = @telephone, 
                            ICE = @ICE, 
                            adresse = @adresse
                        WHERE id = @id";

                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    command.Parameters.AddWithValue("@raison_social", fr.raison_social ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@telephone", fr.telephone);
                    command.Parameters.AddWithValue("@ICE", fr.ice);
                    command.Parameters.AddWithValue("@adresse", fr.adresse ?? (object)DBNull.Value);

                    int result = command.ExecuteNonQuery();
                    return result > 0;

                }
            }
        }

        public bool Delete(string id)
        {
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                string query = "DELETE FROM Fournisseurs WHERE id=@id";
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    int resulat = command.ExecuteNonQuery();
                    return resulat > 0;
                }
            }
        }
    }
}