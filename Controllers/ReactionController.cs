using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tabloid.Data;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReactionController : ControllerBase
{
    private TabloidDbContext _dbContext;
    public ReactionController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetReactions()
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while processing your request {ex.Message}");
        }
    }
}