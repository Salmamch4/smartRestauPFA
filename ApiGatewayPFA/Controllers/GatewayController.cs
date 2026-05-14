using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiGatewayPFA.Controllers
{
    [ApiController]
    [Route("api/gateway")]
    public class GatewayController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                status = "OK",
                timestamp = DateTime.Now,
                gateway = "SmartResto API Gateway",
                version = "1.0.0"
            });
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "pong", timestamp = DateTime.Now });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            if (HttpContext.User == null)
            {
                return Unauthorized();
            }

            var userId = HttpContext.User.FindFirst("id")?.Value;
            var role = HttpContext.User.FindFirst("role")?.Value;
            var telephone = HttpContext.User.FindFirst("telephone")?.Value;

            return Ok(new
            {
                authenticated = true,
                userId = userId,
                role = role,
                telephone = telephone
            });
        }

        [HttpGet("routes")]
        public IActionResult GetRoutes()
        {
            var routes = new[]
            {
                new { path = "/api/gateway/health", method = "GET", description = "Health check" },
                new { path = "/api/gateway/ping", method = "GET", description = "Ping" },
                new { path = "/api/gateway/me", method = "GET", description = "User info (auth required)" },
                new { path = "/api/auth/*", method = "ALL", description = "Authentication (Laravel:8000)" },
                new { path = "/api/commandes/*", method = "ALL", description = "Orders (Spring:8082)" },
                new { path = "/api/articles/*", method = "ALL", description = "Articles (.NET:5160)" },
                new { path = "/api/achats/*", method = "ALL", description = "Achats (.NET:5160)" },
                new { path = "/api/produits/*", method = "ALL", description = "Produits (.NET:7277)" },
                new { path = "/api/tickets/*", method = "ALL", description = "Tickets (Spring:8083)" }
            };

            return Ok(new { gateway = "http://localhost:5000", routes = routes });
        }
    }
}