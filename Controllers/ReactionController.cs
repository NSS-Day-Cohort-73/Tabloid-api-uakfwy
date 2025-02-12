using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tabloid.Data;
using Tabloid.Models.DTOs;

[ApiController]
[Route("/api/[controller]")]
public class ReactionController : ControllerBase
{
    private TabloidDbContext _dbContext;
    public ReactionController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    IActionResult GetReactions()
    {
        return Ok(_dbContext
        .Reactions
        .Select(r => new ReactionDTO
        {
            Id = r.Id,
            Name = r.Name,
            Icon = r.Icon
        }));
    }
}