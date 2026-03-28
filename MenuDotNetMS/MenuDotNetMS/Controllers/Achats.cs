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
        public IActionResult Add(AchatAddDTORequest dto) //2024-12-25T15:30:00
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

        [HttpGet("{id}")] //11111111-1111-1111-1111-111111111111
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
        public IActionResult GetAll()
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
        public IActionResult Update(Guid id,AchatUpdateDTORequest dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            { return UnprocessableEntity(); }

            if (dto.DateAchat < new DateTime(1753, 1, 1))
            {
                return BadRequest();
            }

            var existingAchat = _repo.GetById(id);
            if (existingAchat == null)
            {
                return NotFound();
            }

            var achatToUpdate = AchatsMapper.ToModel(dto);
            achatToUpdate.Id = id;

            bool response = _repo.Update(achatToUpdate);

            if (response)
            {
                return NoContent();
            }

            return StatusCode(500);
        }

        [HttpPatch("{id}/quantite-restante")]
        public IActionResult UpdateQuantiteRestante(Guid id,QuantiteRestanteUpdateDTORequest dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            { return UnprocessableEntity(); }

            var achat = _repo.GetById(id);

            if (achat == null)
            {
                return NotFound();
            }

            if (dto.NouvelleQuantiteRestante > achat.QuantiteAchat || dto.NouvelleQuantiteRestante < 0)
            {
                return BadRequest();
            }


            var QuantiteToUpdate = AchatsMapper.ToModel(dto);

            bool response = _repo.UpdateQuantiteRestante(QuantiteToUpdate);

            if (response)
            {
                return NoContent();
            }

            return StatusCode(500);
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