using MenuDotNetMS.DTOs.fournisseur;
using MenuDotNetMS.Mappers;
using MenuDotNetMS.Models;
using MenuDotNetMS.Repositories.fournisseur;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MenuDotNetMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class fournisseurController : ControllerBase
    {
        private readonly IFournisseurRepository repository;
        public fournisseurController(IFournisseurRepository repository)
        {
            this.repository = repository;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            var fournisseurs = repository.GetAll();
            return Ok(fournisseurs);

        }
        [HttpPost]
        public IActionResult Add(fournissueurAddDtoRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var model = fournisseurMapper.ToModel(request);
            var added = repository.Add(model);
            if (!added) return StatusCode(500, "erro inserting fournisseur");
            var response = fournisseurMapper.ToAddDto(model);
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var fr = repository.GetById(id);
            if (fr == null) return NotFound();
            return Ok(fr);
        }
        [HttpGet("{ice}")]
        public IActionResult GetByICE(string ice)
        {
            var fr = repository.GetByICE(ice);
            if (fr == null) return NotFound();
            return Ok(fr);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var deleted = repository.Delete(id);
            if (!deleted) return NotFound();
            return Ok(deleted);
        }
        [HttpPatch("{id}")]
        public IActionResult Update(string id, fournissuerUpdateDtoRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var model = fournisseurMapper.ToModel(request);
            var updated = repository.Update(id, model);
            if (!updated) return NotFound();
            return NoContent();
        }
    }
}