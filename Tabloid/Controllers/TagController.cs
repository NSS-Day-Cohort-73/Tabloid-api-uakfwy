using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
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
    public IActionResult Get()
    {
        return Ok(_dbContext.Tags
            .Include(t => t.PostTags)
            .OrderBy(t => t.TagName)
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
}