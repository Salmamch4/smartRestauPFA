using MenuDotNetMS.DTOs.achat;
using MenuDotNetMS.Mappers;
using MenuDotNetMS.Models;
using MenuDotNetMS.Repositories.achat;
using MenuDotNetMS.Repositories.article;      
using MenuDotNetMS.Repositories.fournisseur;
using Microsoft.AspNetCore.Mvc;

namespace MenuDotNetMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchatsController : ControllerBase
    {
        private readonly IAchatsRepository _repo;
        private readonly IArticleRepository _articleRepo;      
        private readonly IFournisseurRepository _fournisseurRepo;

        public AchatsController( IAchatsRepository repo, IArticleRepository articleRepo, IFournisseurRepository fournisseurRepo)  
        {
            _repo = repo;
            _articleRepo = articleRepo;                
            _fournisseurRepo = fournisseurRepo;        
        }

        [HttpPost]
        public IActionResult Add(AchatAddDTORequest dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            if (dto.Articles == null || !dto.Articles.Any())
                return BadRequest("Vous devez ajouter au moins un article");

            foreach (var article in dto.Articles)
            {
                var existingArticle = _articleRepo.GetById(article.IdArticle);
                if (existingArticle == null)
                    return BadRequest($"Article avec ID {article.IdArticle} non trouvé");

                var existingFournisseur = _fournisseurRepo.GetById(article.IdFournisseur.ToString());
                if (existingFournisseur == null)
                    return BadRequest($"Fournisseur avec ID {article.IdFournisseur} non trouvé");
            }

            var achats = AchatsMapper.ToModelList(dto);
            bool response = _repo.AddMultiple(achats);

            if (response)
            {
                return Ok(new
                {
                    message = "Achat enregistré avec succès",
                    nombreArticles = achats.Count
                });
            }

            return StatusCode(500, "Erreur lors de l'ajout de l'achat");
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