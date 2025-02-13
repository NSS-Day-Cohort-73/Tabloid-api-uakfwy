using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
using Tabloid.Models;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private TabloidDbContext _dbContext;

    public TagController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int? postId)
    {
        try 
        {
        IQueryable<Tag> query = _dbContext.Tags
            .Include(t => t.PostTags)
            .OrderBy(t => t.TagName);

            if (postId.HasValue)
            {
                query = query.Where(t => t.PostTags.Any(pt => pt.PostId == postId.Value));
            }

            if (postId <= 0)
            {
                return BadRequest("postId must be a positive integer");
            }

            return Ok(query
            .Select(t => new TagDTO
            {
                Id = t.Id,
                TagName = t.TagName,
                PostTags = t.PostTags.Select(pt => new PostTagDTO
                {
                    Id = pt.Id,
                    PostId = pt.PostId,
                    TagId = pt.TagId
                }).ToList()
            }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred processing your request {ex.Message}");
        }
    }
}