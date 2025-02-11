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
                .Categories.Select(cat => new CategoryDTO
                {
                    Id = cat.Id,
                    CategoryName = cat.CategoryName,
                })
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
}
