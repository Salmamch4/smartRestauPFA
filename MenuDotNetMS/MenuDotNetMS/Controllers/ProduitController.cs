using Microsoft.AspNetCore.Mvc;
using MenuDotNetMS.Repositories.produit;
using MenuDotNetMS.DTOs.Produit;
using MenuDotNetMS.Mappers;
using MenuDotNetMS.Models;
using System;
using System.IO;
using System.Linq;

namespace MenuDotNetMS.Controllers
{
    [ApiController]
    [Route("api/produits")]
    public class ProduitController : ControllerBase
    {
        private readonly IProduitRepository _repository;
        private readonly IWebHostEnvironment _env;

        public ProduitController(IProduitRepository repository, IWebHostEnvironment env)
        {
            _repository = repository;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var produits = _repository.GetAll();
                var response = produits.Select(p => ProduitMapper.ToResponseDTO(p)).ToList();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erreur de récupération", error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult Create([FromForm] ProduitCreateDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var produit = ProduitMapper.ToProduit(dto);
            produit.Id = Guid.NewGuid();
            produit.DateCreation = DateTime.Now;

            if (produit.IdCategorie == Guid.Empty)
                produit.IdCategorie = Guid.Parse("ADE0388B-C2CD-4E15-93FF-9A5901B8CC9A");

            if (produit.Ingrédients != null)
            {
                foreach (var item in produit.Ingrédients) item.ProduitId = produit.Id;
            }

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                string fileName = Guid.NewGuid() + Path.GetExtension(dto.ImageFile.FileName);
                string fullPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "images", fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create)) { dto.ImageFile.CopyTo(stream); }
                produit.ImagePath = "/images/" + fileName;
            }

            try
            {
                _repository.Add(produit);
                return Ok(new { message = "Créé avec succès", id = produit.Id });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromForm] ProduitCreateDTO dto)
        {
            var existing = _repository.GetById(id);
            if (existing == null) return NotFound();

            existing.Nom = dto.Nom;
            existing.Prix = dto.Prix;
            existing.Description = dto.Description;
            existing.IdCategorie = dto.IdCategorie;

            // Mise à jour des ingrédients
            existing.Ingrédients = dto.Ingrédients?.Select(i => new CompositionProduit
            {
                ProduitId = id,
                ArticleId = i.ArticleId,
                Quantite = i.Quantite
            }).ToList() ?? new List<CompositionProduit>();

            // Mise à jour de l'image (si une nouvelle est fournie)
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                string fileName = Guid.NewGuid() + Path.GetExtension(dto.ImageFile.FileName);
                string fullPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "images", fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create)) { dto.ImageFile.CopyTo(stream); }
                existing.ImagePath = "/images/" + fileName;
            }

            try
            {
                _repository.Update(existing);
                return Ok(new { message = "Mis à jour avec succès" });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _repository.Delete(id);
            return Ok(new { message = "Supprimé" });
        }
    }
}