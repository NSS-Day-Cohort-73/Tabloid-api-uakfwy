using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
using Tabloid.Models;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private TabloidDbContext _dbContext;

    public PostController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll([FromQuery] int? count, [FromQuery] int? userId)
    {
        IQueryable<Post> query = _dbContext
        .Posts
        .Include(p => p.User)
        .Include(p => p.Category)
        .Where(p => p.Approved == true)
        .Where(p => p.PublishDate <= DateTime.Now);

        if (count.HasValue)
        {
            query = query.Take(count.Value);
        }

        if (userId.HasValue)
        {
            query = query.Where(p => p.UserId == userId);
        }

        query = query.OrderByDescending(p => p.PublishDate);

        return Ok(query
        .Select(p => new PostDTO
        {

        }));
        
    }
}
