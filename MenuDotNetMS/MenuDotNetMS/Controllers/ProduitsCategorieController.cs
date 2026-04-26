using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace MenuDotNetMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduitsCategorieController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProduitsCategorieController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("categorie/{categorieId}")]
        public async Task<IActionResult> GetByCategorie(Guid categorieId)
        {
            var produits = new List<Dictionary<string, object>>();
            string connectionString = _configuration.GetConnectionString("menu");

            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                await cn.OpenAsync();
                string query = @"
                    SELECT id, libelle, description, prix_unitaire, photo, id_categorie, DateCreation
                    FROM Produits 
                    WHERE id_categorie = @CategorieId
                    ORDER BY libelle";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@CategorieId", categorieId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var produit = new Dictionary<string, object>
                            {
                                ["id"] = reader["id"].ToString(),
                                ["libelle"] = reader["libelle"].ToString(),
                                ["description"] = reader["description"]?.ToString() ?? "",
                                ["prix_unitaire"] = Convert.ToDecimal(reader["prix_unitaire"]),
                                ["photo"] = reader["photo"]?.ToString() ?? "",
                                ["id_categorie"] = reader["id_categorie"].ToString(),
                                ["dateCreation"] = reader["DateCreation"].ToString()
                            };
                            produits.Add(produit);
                        }
                    }
                }
            }

            Console.WriteLine($"Produits trouvés: {produits.Count}");
            return Ok(produits);
        }
    }
}