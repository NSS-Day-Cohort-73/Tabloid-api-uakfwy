using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
using Tabloid.Models;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private TabloidDbContext _dbContext;

    public CategoryController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAllCategories()
    {
        return Ok(
            _dbContext
                .Categories.OrderBy(c => c.Id)
                .Select(cat => new CategoryDTO { Id = cat.Id, CategoryName = cat.CategoryName })
                .ToList()
        );
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateCategory(CreateCategoryDTO categoryDTO)
    {
        var category = new Category { CategoryName = categoryDTO.CategoryName };

        _dbContext.Categories.Add(category);
        _dbContext.SaveChanges();
        return Created($"/api/category/{category.Id}", category);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateCategory(CreateCategoryDTO categoryDTO, int id)
    {
        Category categoryToUpdate = _dbContext.Categories.SingleOrDefault(c => c.Id == id);

        if (categoryToUpdate == null)
        {
            return NotFound();
        }

        categoryToUpdate.CategoryName = categoryDTO.CategoryName;

        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteCategory(int id)
    {
        Category categoryToDelete = _dbContext.Categories.SingleOrDefault(c => c.Id == id);

        if (categoryToDelete == null)
        {
            return NotFound();
        }

        _dbContext.Remove(categoryToDelete);
        _dbContext.SaveChanges();
        return NoContent();
    }
}
