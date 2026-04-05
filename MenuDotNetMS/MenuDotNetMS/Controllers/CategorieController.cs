using MenuDotNetMS.DTOs.categorie;
using MenuDotNetMS.Mappers;
using MenuDotNetMS.Repositories.categorie;
using Microsoft.AspNetCore.Mvc;

namespace MenuDotNetMS.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategorieController : ControllerBase
    {
        private readonly ICategorieRepository _repository;

        public CategorieController(ICategorieRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _repository.GetAll();
            return Ok(categories);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CategorieCreateDTO dto)
        {
            if (dto == null) return BadRequest("DTO is null");
            var categorie = CategorieMapper.ToCategorie(dto);
            _repository.Add(categorie);
            return Ok(categorie);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] CategorieCreateDTO dto)
        {
            if (dto == null) return BadRequest("DTO is null");
            var existing = _repository.GetById(id);
            if (existing == null) return NotFound();
            existing.Libelle = dto.Libelle;
            existing.Description = dto.Description;
            _repository.Update(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var existing = _repository.GetById(id);
            if (existing == null) return NotFound();
            _repository.Delete(id);
            return Ok();
        }
    }
}