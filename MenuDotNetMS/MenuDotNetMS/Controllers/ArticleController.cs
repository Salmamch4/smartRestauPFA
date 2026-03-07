using Microsoft.AspNetCore.Mvc;
using MenuDotNetMS.Repositories.article;
using MenuDotNetMS.models;
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

        [HttpGet]
        public IActionResult GetAll()
        {
            var articles = _repository.GetAll();
            return Ok(articles);
        }

        [HttpPost]
        public IActionResult Create(ArticleCreateDTO dto)
        {
            var article = ArticleMapper.ToArticle(dto);

            _repository.Add(article);

            return Ok(article);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, ArticleCreateDTO dto)
        {
            var article = ArticleMapper.ToArticle(dto);

            _repository.Update(id, article);

            return Ok(article);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _repository.Delete(id);
            return Ok();
        }
    }
}