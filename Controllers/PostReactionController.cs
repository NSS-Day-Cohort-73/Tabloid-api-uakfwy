using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tabloid.Data;
using Tabloid.Models;

[ApiController]
[Route("api/[controller]")]
public class PostReactionController : ControllerBase
{
    private TabloidDbContext _dbContext;
    public PostReactionController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpPost]
    [Authorize]
    public IActionResult NewReaction(PostReaction reaction)
    {
        try
        {
        _dbContext.PostReactions.Add(reaction);
        _dbContext.SaveChanges();
        return Created($"/api/postreaction/{reaction.Id}", reaction);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while processing your request {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteReaction(int id)
    {
        try
        {
        PostReaction reaction = _dbContext
        .PostReactions
        .SingleOrDefault(r => r.Id == id);

        if (reaction == null)
        {
            return NotFound("That PostReaction doesn't exist.");
        }

        _dbContext.PostReactions.Remove(reaction);
        _dbContext.SaveChanges();

        return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while processing your request {ex.Message}");
        }
    }
}
