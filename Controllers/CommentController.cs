using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
using Tabloid.Models;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private TabloidDbContext _dbContext;

    public CommentController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet("{postId}")]
    [Authorize]
    public IActionResult GetCommentsByPostId(int postId)
    {
        return Ok(
            _dbContext
                .Comments.Where(c => c.PostId == postId)
                .OrderByDescending(c => c.DateSubmitted)
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.IdentityUser)
                .Select(c => new CommentDTO
                {
                    Id = c.Id,
                    PostId = c.PostId,
                    UserProfileId = c.UserProfileId,
                    Body = c.Body,
                    DateSubmitted = c.DateSubmitted,
                    UserProfile = new UserProfileDTO
                    {
                        Id = c.UserProfile.Id,
                        FirstName = c.UserProfile.FirstName,
                        LastName = c.UserProfile.LastName,
                        UserName = c.UserProfile.IdentityUser.UserName,
                        Email = c.UserProfile.IdentityUser.Email,
                        CreateDateTime = c.UserProfile.CreateDateTime,
                        ImageLocation = c.UserProfile.ImageLocation,
                        IdentityUserId = c.UserProfile.IdentityUserId,
                    },
                })
                .ToList()
        );
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateComment(CreateCommentDTO createCommentDTO)
    {
        Comment commentToAdd = new Comment
        {
            PostId = createCommentDTO.PostId,
            UserProfileId = createCommentDTO.UserProfileId,
            Body = createCommentDTO.Body,
        };

        _dbContext.Comments.Add(commentToAdd);
        _dbContext.SaveChanges();

        return Created($"/api/comments/{commentToAdd.Id}", commentToAdd);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteComment(int id)
    {
        Comment commentToDelete = _dbContext.Comments.SingleOrDefault(c => c.Id == id);

        if (commentToDelete == null)
        {
            return NotFound();
        }

        _dbContext.Remove(commentToDelete);
        _dbContext.SaveChanges();
        return NoContent();
    }
}
