using Microsoft.Data.SqlClient;
using MenuDotNetMS.models;

namespace MenuDotNetMS.Repositories.article
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly string _connectionString;

        public ArticleRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("menu");
        }

        // 🔹 GET ALL
        public List<Article> GetAll()
        {
            List<Article> articles = new List<Article>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"SELECT Id, Libelle, Quantite_EnStock, SeuilAlerte, Unite, DateCreation 
                                 FROM Articles";

                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    articles.Add(new Article
                    {
                        Id = Guid.Parse(reader["Id"].ToString()),
                        Libelle = reader["Libelle"].ToString(),
                        QuantiteEnStock = Convert.ToInt32(reader["Quantite_EnStock"]),
                        SeuilAlerte = Convert.ToInt32(reader["SeuilAlerte"]),
                        Unite = reader["Unite"].ToString(), 
                        DateCreation = Convert.ToDateTime(reader["DateCreation"])
                    });
                }

                reader.Close();
            }

            return articles;
        }

        // 🔹 GET BY ID
        public Article GetById(Guid id)
        {
            Article article = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"SELECT Id, Libelle, Quantite_EnStock, SeuilAlerte, Unite, DateCreation 
                                 FROM Articles 
                                 WHERE Id=@Id";

                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    article = new Article
                    {
                        Id = Guid.Parse(reader["Id"].ToString()),
                        Libelle = reader["Libelle"].ToString(),
                        QuantiteEnStock = Convert.ToInt32(reader["Quantite_EnStock"]),
                        SeuilAlerte = Convert.ToInt32(reader["SeuilAlerte"]),
                        Unite = reader["Unite"].ToString(), 
                        DateCreation = Convert.ToDateTime(reader["DateCreation"])
                    };
                }

                reader.Close();
            }

            return article;
        }

        // 🔹 CREATE
        public void Add(Article article)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Articles 
                                 (Id, Libelle, Quantite_EnStock, SeuilAlerte, Unite, DateCreation) 
                                 VALUES 
                                 (@Id, @Libelle, @QuantiteEnStock, @SeuilAlerte, @Unite, GETDATE())";

                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                command.Parameters.AddWithValue("@Libelle", article.Libelle);
                command.Parameters.AddWithValue("@QuantiteEnStock", article.QuantiteEnStock);
                command.Parameters.AddWithValue("@SeuilAlerte", article.SeuilAlerte);
                command.Parameters.AddWithValue("@Unite", article.Unite); 

                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        // 🔹 UPDATE
        public void Update(Article article)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Articles 
                                 SET 
                                 Libelle = @Libelle,
                                 Quantite_EnStock = @QuantiteEnStock,
                                 SeuilAlerte = @SeuilAlerte,
                                 Unite = @Unite
                                 WHERE Id = @Id";

                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Id", article.Id);
                command.Parameters.AddWithValue("@Libelle", article.Libelle);
                command.Parameters.AddWithValue("@QuantiteEnStock", article.QuantiteEnStock);
                command.Parameters.AddWithValue("@SeuilAlerte", article.SeuilAlerte);
                command.Parameters.AddWithValue("@Unite", article.Unite); 
                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        // 🔹 DELETE
        public void Delete(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Articles WHERE Id=@Id";

                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}