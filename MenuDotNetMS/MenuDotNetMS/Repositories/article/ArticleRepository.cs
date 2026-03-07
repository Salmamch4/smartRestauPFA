using Microsoft.Data.SqlClient;
using MenuDotNetMS.models;

namespace MenuDotNetMS.Repositories.article
{
    public class ArticleRepository : IArticleRepository
    {

        private readonly string _connectionString;

        public ArticleRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<Article> GetAll()
        {

            List<Article> articles = new List<Article>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {

                string query = "SELECT Id, Libelle, Quantite_EnStock, SeuilAlerte, DateCreation FROM Articles";

                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {

                    Article article = new Article
                    {
                        Id = Guid.Parse(reader["Id"].ToString()),
                        Libelle = reader["Libelle"].ToString(),
                        QuantiteEnStock = Convert.ToInt32(reader["Quantite_EnStock"]),
                        SeuilAlerte = Convert.ToInt32(reader["SeuilAlerte"]),
                        DateCreation = Convert.ToDateTime(reader["DateCreation"])
                    };

                    articles.Add(article);
                }

                reader.Close();
            }

            return articles;
        }

        public void Add(Article article)
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {

                string query = @"INSERT INTO Articles 
                                (Libelle, Quantite_EnStock, SeuilAlerte) 
                                VALUES 
                                (@Libelle, @QuantiteEnStock, @SeuilAlerte)";

                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Libelle", article.Libelle);
                command.Parameters.AddWithValue("@QuantiteEnStock", article.QuantiteEnStock);
                command.Parameters.AddWithValue("@SeuilAlerte", article.SeuilAlerte);

                connection.Open();

                command.ExecuteNonQuery();
            }
        }

        public void Update(Guid id, Article article)
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {

                string query = @"UPDATE Articles 
                                SET 
                                Libelle = @Libelle, 
                                Quantite_EnStock = @QuantiteEnStock,
                                SeuilAlerte = @SeuilAlerte
                                WHERE Id = @Id";

                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Libelle", article.Libelle);
                command.Parameters.AddWithValue("@QuantiteEnStock", article.QuantiteEnStock);
                command.Parameters.AddWithValue("@SeuilAlerte", article.SeuilAlerte);

                connection.Open();

                command.ExecuteNonQuery();
            }
        }

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