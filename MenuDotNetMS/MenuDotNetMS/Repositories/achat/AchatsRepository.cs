using MenuDotNetMS.Models;
using Microsoft.Data.SqlClient;

namespace MenuDotNetMS.Repositories.achat
{
    public class AchatsRepository : IAchatsRepository
    {
        private readonly IConfiguration _config;

        public AchatsRepository(IConfiguration config)
        {
            _config = config;
        }

        // ADD SINGLE ARTICLE
        public bool Add(Achat achat)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                if (achat.Id == Guid.Empty)
                {
                    achat.Id = Guid.NewGuid();
                }

                string query = @"INSERT INTO Achats 
                    (id, date_achat, id_article, id_fournisseur, 
                     Quantite_Achat, Quantite_Restante, prix_achatUnitaire) 
                    VALUES (@Id, @DateAchat, @IdArticle, @IdFournisseur, 
                            @QuantiteAchat, @QuantiteRestante, @PrixAchatUnitaire)";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", achat.Id);
                    cmd.Parameters.AddWithValue("@DateAchat", achat.DateAchat);
                    cmd.Parameters.AddWithValue("@IdArticle", achat.IdArticle);
                    cmd.Parameters.AddWithValue("@IdFournisseur", achat.IdFournisseur);
                    cmd.Parameters.AddWithValue("@QuantiteAchat", achat.QuantiteAchat);
                    cmd.Parameters.AddWithValue("@QuantiteRestante", achat.QuantiteRestante);
                    cmd.Parameters.AddWithValue("@PrixAchatUnitaire",
                        achat.PrixAchatUnitaire ?? (object)DBNull.Value);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }

        // ADD MULTIPLE 
        public bool AddMultiple(List<Achat> achats)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();
                using (SqlTransaction transaction = cn.BeginTransaction())
                {
                    try
                    {
                        foreach (var achat in achats)
                        {
                            if (achat.Id == Guid.Empty)
                            {
                                achat.Id = Guid.NewGuid();
                            }

                            string query = @"INSERT INTO Achats 
                                (id, date_achat, id_article, id_fournisseur, 
                                 Quantite_Achat, Quantite_Restante, prix_achatUnitaire) 
                                VALUES (@Id, @DateAchat, @IdArticle, @IdFournisseur, 
                                        @QuantiteAchat, @QuantiteRestante, @PrixAchatUnitaire)";

                            using (SqlCommand cmd = new SqlCommand(query, cn, transaction))
                            {
                                cmd.Parameters.AddWithValue("@Id", achat.Id);
                                cmd.Parameters.AddWithValue("@DateAchat", achat.DateAchat);
                                cmd.Parameters.AddWithValue("@IdArticle", achat.IdArticle);
                                cmd.Parameters.AddWithValue("@IdFournisseur", achat.IdFournisseur);
                                cmd.Parameters.AddWithValue("@QuantiteAchat", achat.QuantiteAchat);
                                cmd.Parameters.AddWithValue("@QuantiteRestante", achat.QuantiteRestante);
                                cmd.Parameters.AddWithValue("@PrixAchatUnitaire",
                                    achat.PrixAchatUnitaire ?? (object)DBNull.Value);

                                cmd.ExecuteNonQuery();
                            }

                            // Mise à jour du stock
                            UpdateStockArticle(cn, transaction, achat.IdArticle, achat.QuantiteAchat);
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        public List<Achat> GetAll()
        {
            List<Achat> achats = new List<Achat>();

            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
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
                            achats.Add(MapToAchat(rd));
                        }
                    }
                }
            }

            return achats;
        }

        public Achat GetById(Guid id)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
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
                            return MapToAchat(rd);
                        }
                    }
                }
            }

            return null;
        }

        public bool Update(Achat achat)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
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
                    cmd.Parameters.AddWithValue("@PrixAchatUnitaire",
                        achat.PrixAchatUnitaire ?? (object)DBNull.Value);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }

        public bool Delete(Guid id)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
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

            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
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
                            achats.Add(MapToAchat(rd));
                        }
                    }
                }
            }

            return achats;
        }

        public List<Achat> GetAchatsByFournisseur(Guid idFournisseur)
        {
            List<Achat> achats = new List<Achat>();

            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
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
                            achats.Add(MapToAchat(rd));
                        }
                    }
                }
            }

            return achats;
        }

        // ==================== UPDATE QUANTITE RESTANTE ====================
        public bool UpdateQuantiteRestante(Achat achat)
        {
            using (SqlConnection cn = new SqlConnection(_config.GetConnectionString("menu")))
            {
                cn.Open();

                string query = @"UPDATE Achats 
                        SET Quantite_Restante = @QuantiteRestante
                        WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@Id", achat.Id);
                    cmd.Parameters.AddWithValue("@QuantiteRestante", achat.QuantiteRestante);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }
        }

        private Achat MapToAchat(SqlDataReader rd)
        {
            return new Achat
            {
                Id = rd.GetGuid(rd.GetOrdinal("id")),
                DateAchat = rd.GetDateTime(rd.GetOrdinal("date_achat")),
                IdArticle = rd.GetGuid(rd.GetOrdinal("id_article")),
                IdFournisseur = rd.GetGuid(rd.GetOrdinal("id_fournisseur")),
                QuantiteAchat = rd.GetInt32(rd.GetOrdinal("Quantite_Achat")),
                QuantiteRestante = rd.GetInt32(rd.GetOrdinal("Quantite_Restante")),
                PrixAchatUnitaire = rd.IsDBNull(rd.GetOrdinal("prix_achatUnitaire"))
                    ? null
                    : rd.GetDecimal(rd.GetOrdinal("prix_achatUnitaire"))
            };
        }

        private void UpdateStockArticle(SqlConnection cn, SqlTransaction transaction, Guid articleId, int quantite)
        {
            string query = @"UPDATE Articles 
                    SET Quantite_EnStock = Quantite_EnStock + @Quantite 
                    WHERE id = @IdArticle";

            using (SqlCommand cmd = new SqlCommand(query, cn, transaction))
            {
                cmd.Parameters.AddWithValue("@Quantite", quantite);
                cmd.Parameters.AddWithValue("@IdArticle", articleId);
                cmd.ExecuteNonQuery();
            }
        }
    }
}