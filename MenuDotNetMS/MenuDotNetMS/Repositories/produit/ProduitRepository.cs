using Microsoft.Data.SqlClient;
using MenuDotNetMS.Models;
using System.Data;

namespace MenuDotNetMS.Repositories.produit
{
    public class ProduitRepository : IProduitRepository
    {
        private readonly string _connectionString;

        public ProduitRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("menu") ?? "";
        }

        public void Add(Produit produit)
        {
            using (var cn = new SqlConnection(_connectionString))
            {
                cn.Open();
                using (var transaction = cn.BeginTransaction())
                {
                    try
                    {
                        string sqlProd = @"INSERT INTO Produits (Id, Nom, Prix, Description, DateCreation, ImagePath, IdCategorie) 
                                         VALUES (@Id, @Nom, @Prix, @Desc, @Date, @Img, @CatId)";

                        using (var cmd = new SqlCommand(sqlProd, cn, transaction))
                        {
                            cmd.Parameters.Add("@Id", SqlDbType.UniqueIdentifier).Value = produit.Id;
                            cmd.Parameters.AddWithValue("@Nom", produit.Nom);
                            cmd.Parameters.AddWithValue("@Prix", produit.Prix);
                            cmd.Parameters.AddWithValue("@Desc", (object?)produit.Description ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Date", produit.DateCreation);
                            cmd.Parameters.AddWithValue("@Img", (object?)produit.ImagePath ?? DBNull.Value);
                            cmd.Parameters.Add("@CatId", SqlDbType.UniqueIdentifier).Value = produit.IdCategorie;
                            cmd.ExecuteNonQuery();
                        }

                        if (produit.Ingrédients != null)
                        {
                            foreach (var item in produit.Ingrédients)
                            {
                                string sqlComp = "INSERT INTO CompositionProduit (ProduitId, ArticleId, Quantite) VALUES (@PId, @AId, @Qty)";
                                using (var cmdComp = new SqlCommand(sqlComp, cn, transaction))
                                {
                                    cmdComp.Parameters.Add("@PId", SqlDbType.UniqueIdentifier).Value = produit.Id;
                                    cmdComp.Parameters.Add("@AId", SqlDbType.UniqueIdentifier).Value = item.ArticleId;
                                    cmdComp.Parameters.AddWithValue("@Qty", item.Quantite);
                                    cmdComp.ExecuteNonQuery();
                                }
                            }
                        }
                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception("Erreur SQL lors de l'ajout : " + ex.Message);
                    }
                }
            }
        }

        public IEnumerable<Produit> GetAll()
        {
            var dictionary = new Dictionary<Guid, Produit>();
            using (var cn = new SqlConnection(_connectionString))
            {
                cn.Open();
                // CORRECTION ICI : a.Libelle au lieu de a.designation
                string sql = @"SELECT p.*, c.libelle as CategorieLibelle, 
                              cp.ArticleId, cp.Quantite, a.Libelle as ArticleLibelle
                       FROM Produits p 
                       LEFT JOIN Categories c ON p.IdCategorie = c.id
                       LEFT JOIN CompositionProduit cp ON p.Id = cp.ProduitId
                       LEFT JOIN Articles a ON cp.ArticleId = a.id";

                using (var cmd = new SqlCommand(sql, cn))
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        var pId = (Guid)dr["Id"];
                        if (!dictionary.TryGetValue(pId, out var produit))
                        {
                            produit = new Produit
                            {
                                Id = pId,
                                Nom = dr["Nom"].ToString() ?? "",
                                Prix = Convert.ToDouble(dr["Prix"]),
                                Description = dr["Description"]?.ToString(),
                                ImagePath = dr["ImagePath"]?.ToString(),
                                CategorieLibelle = dr["CategorieLibelle"]?.ToString() ?? "N/A",
                                Ingrédients = new List<CompositionProduit>()
                            };
                            dictionary.Add(pId, produit);
                        }
                        if (dr["ArticleId"] != DBNull.Value)
                        {
                            // On crée un nouvel ingrédient avec son nom
                            var ingrédient = new CompositionProduit
                            {
                                ArticleId = (Guid)dr["ArticleId"],
                                Quantite = Convert.ToDouble(dr["Quantite"]),
                                // AJOUTE CETTE LIGNE (Assure-toi que la propriété existe dans ton modèle)
                                ArticleNom = dr["ArticleLibelle"]?.ToString()
                            };
                            produit.Ingrédients.Add(ingrédient);
                        }
                    }
                }
            }
            return dictionary.Values;
        }

        public Produit? GetById(Guid id)
        {
            return GetAll().FirstOrDefault(p => p.Id == id);
        }

        public void Update(Produit produit)
        {
            using (var cn = new SqlConnection(_connectionString))
            {
                cn.Open();
                using (var transaction = cn.BeginTransaction())
                {
                    try
                    {
                        string sqlUpdate = @"UPDATE Produits SET Nom=@Nom, Prix=@Prix, Description=@Desc, 
                                            ImagePath=@Img, IdCategorie=@CatId WHERE Id=@Id";

                        using (var cmd = new SqlCommand(sqlUpdate, cn, transaction))
                        {
                            cmd.Parameters.Add("@Id", SqlDbType.UniqueIdentifier).Value = produit.Id;
                            cmd.Parameters.AddWithValue("@Nom", produit.Nom);
                            cmd.Parameters.AddWithValue("@Prix", produit.Prix);
                            cmd.Parameters.AddWithValue("@Desc", (object?)produit.Description ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Img", (object?)produit.ImagePath ?? DBNull.Value);
                            cmd.Parameters.Add("@CatId", SqlDbType.UniqueIdentifier).Value = produit.IdCategorie;
                            cmd.ExecuteNonQuery();
                        }

                        // Supprimer les anciens ingrédients
                        string sqlDel = "DELETE FROM CompositionProduit WHERE ProduitId = @PId";
                        using (var cmdDel = new SqlCommand(sqlDel, cn, transaction))
                        {
                            cmdDel.Parameters.Add("@PId", SqlDbType.UniqueIdentifier).Value = produit.Id;
                            cmdDel.ExecuteNonQuery();
                        }

                        // Insérer les nouveaux
                        if (produit.Ingrédients != null)
                        {
                            foreach (var item in produit.Ingrédients)
                            {
                                string sqlIns = "INSERT INTO CompositionProduit (ProduitId, ArticleId, Quantite) VALUES (@PId, @AId, @Qty)";
                                using (var cmdIns = new SqlCommand(sqlIns, cn, transaction))
                                {
                                    cmdIns.Parameters.Add("@PId", SqlDbType.UniqueIdentifier).Value = produit.Id;
                                    cmdIns.Parameters.Add("@AId", SqlDbType.UniqueIdentifier).Value = item.ArticleId;
                                    cmdIns.Parameters.AddWithValue("@Qty", item.Quantite);
                                    cmdIns.ExecuteNonQuery();
                                }
                            }
                        }
                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception("Erreur SQL lors de la mise à jour : " + ex.Message);
                    }
                }
            }
        }

        public void Delete(Guid id)
        {
            using (var cn = new SqlConnection(_connectionString))
            {
                cn.Open();
                string sql = "DELETE FROM Produits WHERE Id = @Id";
                using (var cmd = new SqlCommand(sql, cn))
                {
                    cmd.Parameters.Add("@Id", SqlDbType.UniqueIdentifier).Value = id;
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}