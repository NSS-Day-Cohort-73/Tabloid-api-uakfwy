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
        .Include(p => p.UserProfile)
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
            query = query.Where(p => p.UserProfileId == userId);
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
            UserProfileId = p.UserProfileId,
            UserProfile = new UserProfileDTO
            {
                Id = p.UserProfileId,
                FirstName = p.UserProfile.FirstName,
                LastName = p.UserProfile.LastName,
                UserName = p.UserProfile.IdentityUser.UserName,
                Email = p.UserProfile.IdentityUser.Email,
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

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        try 
        {
        Post post = _dbContext
        .Posts
        .Include(p => p.Comments)
            .ThenInclude(c => c.UserProfile)
                .ThenInclude(up => up.IdentityUser)
        .Include(p => p.Category)
        .Include(p => p.PostTags)
            .ThenInclude(pt => pt.Tag)
        .Include(p => p.PostReactions)
            .ThenInclude(pr => pr.Reaction)
        .Include(p => p.PostReactions)
            .ThenInclude(pr => pr.UserProfile)
                .ThenInclude(up => up.IdentityUser)
        .Include(p => p.UserProfile)
            .ThenInclude(up => up.IdentityUser)
        .SingleOrDefault(p => p.Id == id);

        if (post == null)
        {
            return NotFound("Post not found");
        } 
        else if (id <= 0)
        {
            return BadRequest("Id needs to be a positive integer");
        }
    Console.WriteLine($"PostReactions count: {post.PostReactions?.Count()}"); // Debugging line

        return Ok(new PostDTO
        {
            Id = post.Id,
            UserProfileId = post.UserProfileId,
            UserProfile = new UserProfileDTO
            {
                Id = post.UserProfile.Id,
                UserName = post.UserProfile.IdentityUser.UserName,
                ImageLocation = post.UserProfile.ImageLocation
            },
            Title = post.Title,
            SubTitle = post.SubTitle != null ? post.SubTitle : null,
            Body = post.Body,
            CategoryId = post.CategoryId != null ? post.CategoryId : null,
            Category = post.CategoryId != null ? new CategoryDTO
            {
                Id = post.Category.Id,
                CategoryName = post.Category.CategoryName
            } : null,
            PostTags = post.PostTags != null ? post.PostTags.Select(pt => new PostTagDTO
            {
                Id = pt.Id,
                TagId = pt.TagId,
                Tag = new TagDTO
                {
                    Id = pt.Tag.Id,
                    TagName = pt.Tag.TagName
                }
            }).ToList() : null,
            Comments = post.Comments != null ? post.Comments.Select(c => new CommentDTO
            {
                Id = c.Id,
                UserProfileId = c.UserProfileId,
                UserProfile = new UserProfileDTO
                {
                    Id = c.UserProfile.Id,
                    UserName = c.UserProfile.IdentityUser.UserName
                },
                Body = c.Body,
                DateSubmitted = c.DateSubmitted
            }).ToList() : null,
            PublishDate = post.PublishDate,
            ImageUrl = post.ImageUrl != null ?  post.ImageUrl : null,
            PostReactions = post.PostReactions != null ? post.PostReactions.Select(pr => new PostReactionDTO
            {
                Id = pr.Id,
                PostId = pr.PostId,
                UserProfileId = pr.UserProfileId,
                UserProfile = new UserProfileDTO
                 {
                    Id = pr.UserProfile.Id,
                    UserName = pr.UserProfile.IdentityUser.UserName
                 },
                ReactionId = pr.ReactionId,
                Reaction = new ReactionDTO
                {
                    Id = pr.Reaction.Id,
                    Name = pr.Reaction.Name,
                    Icon = pr.Reaction.Icon
                }
            }).ToList() : null
        });
        }
        catch (Exception ex)
        {
           return StatusCode(500, $"An error occurred while processing your request {ex.Message}"); 
        }

    }
}
