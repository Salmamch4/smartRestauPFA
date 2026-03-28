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


        public bool Add(Achat achat) 
        { 
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                
                cn.Open();
                if (achat.Id == Guid.Empty)
                {
                    achat.Id = Guid.NewGuid();
                }

                string query = @"INSERT INTO Achats (id, date_achat, id_article, id_fournisseur, Quantite_Achat, Quantite_Restante, prix_achatUnitaire) 
                 VALUES (@Id, @DateAchat, @IdArticle, @IdFournisseur, @QuantiteAchat, @QuantiteRestante, @PrixAchatUnitaire)";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", achat.Id);
                    cmd.Parameters.AddWithValue("@DateAchat", achat.DateAchat);
                    cmd.Parameters.AddWithValue("@IdArticle", achat.IdArticle);
                    cmd.Parameters.AddWithValue("@IdFournisseur", achat.IdFournisseur);
                    cmd.Parameters.AddWithValue("@QuantiteAchat", achat.QuantiteAchat);
                    cmd.Parameters.AddWithValue("@QuantiteRestante", achat.QuantiteRestante);
                    cmd.Parameters.AddWithValue("@PrixAchatUnitaire", achat.PrixAchatUnitaire ?? (object)DBNull.Value);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }



            }
        }
        public List<Achat> GetAll()
        {
            List<Achat> achats = new List<Achat>();

            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"SELECT id, date_achat, id_article, id_fournisseur, 
                                Quantite_Achat, Quantite_Restante, prix_achatUnitaire 
                         FROM Achats 
                         ORDER BY date_achat DESC"; 

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            Achat achat = new Achat
                            {
                                Id = rd.GetGuid(rd.GetOrdinal("id")),
                                DateAchat = DateTime.Parse(rd["date_achat"].ToString()),
                                IdArticle = Guid.Parse(rd["id_article"].ToString()),
                                IdFournisseur = Guid.Parse(rd["id_fournisseur"].ToString()),
                                QuantiteAchat = int.Parse(rd["Quantite_Achat"].ToString()),
                                QuantiteRestante = int.Parse(rd["Quantite_Restante"].ToString()),
                                PrixAchatUnitaire = rd["prix_achatUnitaire"] == DBNull.Value ? null : decimal.Parse(rd["prix_achatUnitaire"].ToString())
                            };
                            achats.Add(achat);
                        }
                    }
                }
            }

            return achats;
        }
        public Achat GetById(Guid id)
        {
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"SELECT id, date_achat, id_article, id_fournisseur, 
                                Quantite_Achat, Quantite_Restante, prix_achatUnitaire 
                         FROM Achats 
                         WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        if (rd.Read())
                        {
                            return new Achat
                            {
                                Id = rd.GetGuid(rd.GetOrdinal("id")),
                                DateAchat = DateTime.Parse(rd["date_achat"].ToString()),
                                IdArticle = Guid.Parse(rd["id_article"].ToString()),
                                IdFournisseur = Guid.Parse(rd["id_fournisseur"].ToString()),
                                QuantiteAchat = int.Parse(rd["Quantite_Achat"].ToString()),
                                QuantiteRestante = int.Parse(rd["Quantite_Restante"].ToString()),
                                PrixAchatUnitaire = rd["prix_achatUnitaire"] == DBNull.Value
                                    ? null
                                    : decimal.Parse(rd["prix_achatUnitaire"].ToString())
                            };
                        }
                    }
                }
            }

            return null;
        }
        public bool Update(Achat achat)
        {
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"UPDATE Achats 
                SET date_achat = @DateAchat, 
                    id_article = @IdArticle, 
                    id_fournisseur = @IdFournisseur, 
                    Quantite_Achat = @QuantiteAchat, 
                    Quantite_Restante = @QuantiteRestante, 
                    prix_achatUnitaire = @PrixAchatUnitaire 
                WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", achat.Id);
                    cmd.Parameters.AddWithValue("@DateAchat", achat.DateAchat);
                    cmd.Parameters.AddWithValue("@IdArticle", achat.IdArticle);
                    cmd.Parameters.AddWithValue("@IdFournisseur", achat.IdFournisseur);
                    cmd.Parameters.AddWithValue("@QuantiteAchat", achat.QuantiteAchat);
                    cmd.Parameters.AddWithValue("@QuantiteRestante", achat.QuantiteRestante);
                    cmd.Parameters.AddWithValue("@PrixAchatUnitaire", achat.PrixAchatUnitaire ?? (object)DBNull.Value);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }
        public bool Delete(Guid id)
        {
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = "DELETE FROM Achats WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }
        public List<Achat> GetAchatsByArticle(Guid idArticle)
        {
            List<Achat> achats = new List<Achat>();

            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"SELECT id, date_achat, id_article, id_fournisseur, 
                                Quantite_Achat, Quantite_Restante, prix_achatUnitaire 
                         FROM Achats WHERE id_article = @Id
                         ORDER BY date_achat DESC";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", idArticle);
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            Achat achat = new Achat
                            {
                                Id = rd.GetGuid(rd.GetOrdinal("id")),
                                DateAchat = DateTime.Parse(rd["date_achat"].ToString()),
                                IdArticle = Guid.Parse(rd["id_article"].ToString()),
                                IdFournisseur = Guid.Parse(rd["id_fournisseur"].ToString()),
                                QuantiteAchat = int.Parse(rd["Quantite_Achat"].ToString()),
                                QuantiteRestante = int.Parse(rd["Quantite_Restante"].ToString()),
                                PrixAchatUnitaire = rd["prix_achatUnitaire"] == DBNull.Value ? null : decimal.Parse(rd["prix_achatUnitaire"].ToString())
                            };
                            achats.Add(achat);
                        }
                    }
                }
            }

            return achats;

        }
        public List<Achat> GetAchatsByFournisseur(Guid idFournisseur) {
            List<Achat> achats = new List<Achat>();

            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"SELECT id, date_achat, id_article, id_fournisseur, 
                                Quantite_Achat, Quantite_Restante, prix_achatUnitaire 
                         FROM Achats WHERE id_fournisseur = @Id
                         ORDER BY date_achat DESC";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", idFournisseur);
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            Achat achat = new Achat
                            {
                                Id = rd.GetGuid(rd.GetOrdinal("id")),
                                DateAchat = DateTime.Parse(rd["date_achat"].ToString()),
                                IdArticle = Guid.Parse(rd["id_article"].ToString()),
                                IdFournisseur = Guid.Parse(rd["id_fournisseur"].ToString()),
                                QuantiteAchat = int.Parse(rd["Quantite_Achat"].ToString()),
                                QuantiteRestante = int.Parse(rd["Quantite_Restante"].ToString()),
                                PrixAchatUnitaire = rd["prix_achatUnitaire"] == DBNull.Value ? null : decimal.Parse(rd["prix_achatUnitaire"].ToString())
                            };
                            achats.Add(achat);
                        }
                    }
                }
            }

            return achats;

        }
        public bool UpdateQuantiteRestante(Achat achat)
        {
            using (SqlConnection cn = new SqlConnection(config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"UPDATE Achats 
                        SET Quantite_Restante = @QuantiteRestante
                        WHERE id = @Id";
//
                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", achat.Id);
                    cmd.Parameters.AddWithValue("@QuantiteRestante", achat.QuantiteRestante);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }
    }
}
