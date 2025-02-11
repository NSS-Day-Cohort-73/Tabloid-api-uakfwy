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
    public IActionResult GetAll([FromQuery] int? count, [FromQuery] int? userId, [FromQuery] int? tagId)
    {
        try
        {
        IQueryable<Post> query = _dbContext
        .Posts
        .Include(p => p.User)
            .ThenInclude(u => u.IdentityUser)
        .Include(p => p.Category)
        .Include(p => p.PostTags)
            .ThenInclude(pt => pt.Tag)
        .Where(p => p.Approved == true)
        .Where(p => p.PublishDate <= DateTime.Now);

        if (count.HasValue)
        {
            if (count.Value <= 0)
            {
                return BadRequest("Count must be a positive integer");
            }
            query = query.Take(count.Value);
        }

        if (userId.HasValue)
        {
            bool userExists = _dbContext.UserProfiles.Any(u => u.Id == userId.Value);
            if (!userExists)
            {
                return NotFound("User does not exist.");
            }
            query = query.Where(p => p.UserId == userId);
        }

        if (tagId.HasValue)
        {
            bool tagExists = _dbContext.Tags.Any(t => t.Id == tagId);
            if (!tagExists)
            {
                return NotFound("That tag doesn't exist.");
            }

            query = query.Where(p => p.PostTags.Any(pt => pt.Id == tagId));
        }
        

        query = query.OrderByDescending(p => p.PublishDate);

        return Ok(query
        .Select(p => new PostDTO
        {
            Id = p.Id,
            UserId = p.UserId,
            User = new UserProfileDTO
            {
                Id = p.UserId,
                FirstName = p.User.FirstName,
                LastName = p.User.LastName,
                UserName = p.User.IdentityUser.UserName,
                Email = p.User.IdentityUser.Email,
            },
            Title = p.Title,
            SubTitle = p.SubTitle,
            Body = p.Body,
            CategoryId = p.CategoryId != null ? p.CategoryId : null,
            Category = p.CategoryId != null ? new CategoryDTO
            {
                Id = p.Category.Id,
                CategoryName = p.Category.CategoryName
            } : null,
            PublishDate = p.PublishDate,
            PostTags = p.PostTags.Select(pt => new PostTagDTO
            {
                Id = pt.Id,
                PostId = pt.PostId,
                TagId = pt.TagId,
                Tag = new TagDTO
                {
                    Id = pt.Tag.Id,
                    TagName = pt.Tag.TagName
                }
            }).ToList(),
            ImageUrl = p.ImageUrl
        }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while processing your request {ex.Message}");
        }
        
    }
}
