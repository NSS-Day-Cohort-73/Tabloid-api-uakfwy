using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tabloid.Data;
using Tabloid.Models;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostTagController : ControllerBase
{
    private TabloidDbContext _dbContext;
    public PostTagController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpPost]
    [Authorize]
    public IActionResult NewPostTag([FromBody] PostTag postTag) //Need to add a way to prevent posting a PostTag if that relationship already exists
    {
        try 
        {
            //Checks if the Post exists
        if (!_dbContext.Posts.Any(p => p.Id == postTag.PostId))
        {
            return NotFound("That post doesn't exist");
        }
            //Checks if the Tag exists
        if (!_dbContext.Tags.Any(t => t.Id == postTag.TagId))
        {
            return NotFound("That tag doesn't exist");
        }

        //Checks to see if the relationship already exists, and if it does return BadRequest

        if (_dbContext.PostTags.Any(pt => pt.PostId == postTag.PostId && pt.TagId == postTag.TagId))
        {
            return BadRequest("That relationship already exists");
        }

        _dbContext.PostTags.Add(postTag);
        _dbContext.SaveChanges();

        return Created($"/api/posttag/{postTag.Id}", postTag);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error processing your request {ex.Message}");
        }
    }

    [HttpDelete]
    [Authorize]
    public IActionResult DeletePostTag([FromBody] PostTag postTagDTO) 
    {
        try
        {
        List<PostTag> foundPostTag = _dbContext
        .PostTags
        .Where(pt => pt.TagId == postTagDTO.TagId && pt.PostId == postTagDTO.PostId).ToList();

        if (foundPostTag == null)
        {
            return NotFound("That PostTag relationship doesn't exist");
        }

        _dbContext.PostTags.RemoveRange(foundPostTag);
        _dbContext.SaveChanges();
        return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error processing your request {ex.Message}");
        }
    }
}