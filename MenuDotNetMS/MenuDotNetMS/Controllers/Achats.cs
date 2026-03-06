using MenuDotNetMS.DTOs.achat;
using MenuDotNetMS.Mappers;
using MenuDotNetMS.Models;
using MenuDotNetMS.Repositories.achat;
using Microsoft.AspNetCore.Mvc;

namespace MenuDotNetMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchatsController : ControllerBase
    {
        private readonly IAchatsRepository _repo;

        public AchatsController(IAchatsRepository repo)
        {
            _repo = repo;
        }

        [HttpPost]
        public IActionResult Add(AchatAddDTORequest dto)
        {
            if (!ModelState.IsValid)
            {
                return UnprocessableEntity();
            }

            Achat achat = AchatsMapper.ToModel(dto);
            bool response = _repo.Add(achat);

            if (response)
            {
                var achatResponse = AchatsMapper.ToAddDTO(achat);
                return CreatedAtAction(nameof(GetById), new { id = achat.Id }, achatResponse);
            }

            return StatusCode(500, "Une erreur s'est produite lors de l'ajout de l'achat");
        }

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var achat = _repo.GetById(id);
            if (achat == null)
            {
                return NotFound($"Aucun achat trouvé avec l'ID: {id}");
            }

            var achatResponse = AchatsMapper.ToIndexDTO(achat);
            return Ok(achatResponse);
        }

        [HttpGet]
        public IActionResult Index()
        {
            var achats = _repo.GetAll();
            if (achats == null || !achats.Any())
            {
                return NotFound("Aucun achat trouvé");
            }

            var achatsResponse = achats.Select(a => AchatsMapper.ToIndexDTO(a));
            return Ok(achatsResponse);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var achat = _repo.GetById(id);
            if (achat == null)
            {
                return NotFound($"Aucun achat trouvé avec l'ID: {id}");
            }

            _repo.Delete(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, AchatUpdateDTORequest dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID dans le corps de la requête");
            }

            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            var existingAchat = _repo.GetById(id);
            if (existingAchat == null)
            {
                return NotFound($"Aucun achat trouvé avec l'ID: {id}");
            }

            var achatToUpdate = AchatsMapper.ToModel(dto);
            achatToUpdate.Id = id;

            bool response = _repo.Update(achatToUpdate);

            if (response)
            {
                return NoContent();
            }

            return StatusCode(500, "Une erreur s'est produite lors de la mise à jour de l'achat");
        }

        [HttpPatch("{id}/quantite-restante")]
        public IActionResult UpdateQuantiteRestante(Guid id, [FromBody] int nouvelleQuantiteRestante)
        {
            var achat = _repo.GetById(id);
            if (achat == null)
            {
                return NotFound($"Aucun achat trouvé avec l'ID: {id}");
            }

            // Vérification que la quantité restante ne dépasse pas la quantité d'achat initiale
            if (nouvelleQuantiteRestante > achat.QuantiteAchat)
            {
                return BadRequest($"La quantité restante ({nouvelleQuantiteRestante}) ne peut pas dépasser la quantité d'achat initiale ({achat.QuantiteAchat})");
            }

            // Vérification que la quantité restante n'est pas négative
            if (nouvelleQuantiteRestante < 0)
            {
                return BadRequest("La quantité restante ne peut pas être négative");
            }

            bool updated = _repo.UpdateQuantiteRestante(id, nouvelleQuantiteRestante);

            if (!updated)
            {
                return StatusCode(500, "Erreur lors de la mise à jour de la quantité restante");
            }

            return NoContent();
        }

        [HttpPatch("{id}/utiliser-quantite")]
        public IActionResult UtiliserQuantite(Guid id, [FromBody] int quantiteUtilisee)
        {
            var achat = _repo.GetById(id);
            if (achat == null)
            {
                return NotFound($"Aucun achat trouvé avec l'ID: {id}");
            }

            // Validation métier
            if (quantiteUtilisee <= 0)
            {
                return BadRequest("La quantité utilisée doit être positive");
            }

            if (quantiteUtilisee > achat.QuantiteRestante)
            {
                return BadRequest($"Quantité insuffisante. Restant: {achat.QuantiteRestante}, Demandé: {quantiteUtilisee}");
            }

            int nouvelleQuantiteRestante = achat.QuantiteRestante - quantiteUtilisee;
            bool updated = _repo.UpdateQuantiteRestante(id, nouvelleQuantiteRestante);

            if (!updated)
            {
                return StatusCode(500, "Erreur lors de la mise à jour de la quantité restante");
            }

            return NoContent();
        }

        [HttpGet("article/{idArticle}")]
        public IActionResult GetByArticle(Guid idArticle)
        {
            var achats = _repo.GetAchatsByArticle(idArticle);
            if (achats == null || !achats.Any())
            {
                return NotFound($"Aucun achat trouvé pour l'article avec l'ID: {idArticle}");
            }

            var achatsResponse = achats.Select(a => AchatsMapper.ToIndexDTO(a));
            return Ok(achatsResponse);
        }

        [HttpGet("fournisseur/{idFournisseur}")]
        public IActionResult GetByFournisseur(Guid idFournisseur)
        {
            var achats = _repo.GetAchatsByFournisseur(idFournisseur);
            if (achats == null || !achats.Any())
            {
                return NotFound($"Aucun achat trouvé pour le fournisseur avec l'ID: {idFournisseur}");
            }

            var achatsResponse = achats.Select(a => AchatsMapper.ToIndexDTO(a));
            return Ok(achatsResponse);
        }

        
    }
}