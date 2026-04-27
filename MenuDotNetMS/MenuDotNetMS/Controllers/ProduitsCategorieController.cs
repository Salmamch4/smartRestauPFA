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
                // ✅ CORRECTION : Utiliser les bons noms de colonnes
                string query = @"
                    SELECT Id, Nom, Description, Prix, ImagePath, IdCategorie, DateCreation
                    FROM Produits 
                    WHERE IdCategorie = @CategorieId
                    ORDER BY Nom";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    cmd.Parameters.AddWithValue("@CategorieId", categorieId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var produit = new Dictionary<string, object>
                            {
                                ["id"] = reader["Id"].ToString(),
                                ["libelle"] = reader["Nom"].ToString(),
                                ["description"] = reader["Description"]?.ToString() ?? "",
                                ["prix_unitaire"] = Convert.ToDecimal(reader["Prix"]),
                                ["photo"] = reader["ImagePath"]?.ToString() ?? "",
                                ["id_categorie"] = reader["IdCategorie"].ToString(),
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