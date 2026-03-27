using Microsoft.AspNetCore.Mvc;
using MenuDotNetMS.Repositories.article;
using MenuDotNetMS.DTOs.article;
using MenuDotNetMS.Mappers;

namespace MenuDotNetMS.Controllers
{
    [ApiController]
    [Route("api/articles")]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleRepository _repository;

        public ArticleController(IArticleRepository repository)
        {
            _repository = repository;
        }

        // 🔹 GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            var articles = _repository.GetAll();
            return Ok(articles);
        }

        // 🔹 CREATE
        [HttpPost]
        public IActionResult Create([FromBody] ArticleCreateDTO dto)
        {
            if (dto == null)
                return BadRequest("DTO is null");

            var article = ArticleMapper.ToArticle(dto);

            _repository.Add(article);

            return Ok(article);
        }

        // 🔹 UPDATE (🔥 الحل الحقيقي ديالك)
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] ArticleCreateDTO dto)
        {
            if (dto == null)
                return BadRequest("DTO is null");

            var existing = _repository.GetById(id);

            if (existing == null)
                return NotFound();

            // تحديث القيم فقط
            existing.Libelle = dto.Libelle;
            existing.QuantiteEnStock = dto.QuantiteEnStock;
            existing.SeuilAlerte = dto.SeuilAlerte;

            _repository.Update(existing);

            return Ok(existing);
        }

        // 🔹 DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var existing = _repository.GetById(id);

            if (existing == null)
                return NotFound();

            _repository.Delete(id);

            return Ok();
        }
    }
}