using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
using Tabloid.Models;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private TabloidDbContext _dbContext;

    public UserProfileController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get([FromQuery] int? authorCount)
    {
        IQueryable<UserProfile> userProfiles = _dbContext.UserProfiles.Include(up => up.IdentityUser);

        if (authorCount.HasValue)
        {
            userProfiles = userProfiles
            .Where(up => _dbContext.Posts
                .Any(p => p.UserProfileId == up.Id))
            .OrderByDescending(up => up.CreateDateTime)
            .Take(authorCount.Value);
        }

        return Ok(userProfiles);
    }

    [HttpGet("withroles")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetWithRoles()
    {
        return Ok(
            _dbContext
                .UserProfiles.Include(up => up.IdentityUser)
                .OrderBy(u => u.FirstName)
                .Select(up => new UserProfileDTO
                {
                    Id = up.Id,
                    FirstName = up.FirstName,
                    LastName = up.LastName,
                    Email = up.IdentityUser.Email,
                    UserName = up.IdentityUser.UserName,
                    IdentityUserId = up.IdentityUserId,
                    IsActive = up.IsActive,
                    Roles = _dbContext
                        .UserRoles.Where(ur => ur.UserId == up.IdentityUserId)
                        .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
                        .ToList(),
                })
                .ToList()
        );
    }


    [HttpPost("promote/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Promote(string id)
    {
        IdentityRole role = _dbContext.Roles.SingleOrDefault(r => r.Name == "Admin");
        _dbContext.UserRoles.Add(new IdentityUserRole<string> { RoleId = role.Id, UserId = id });
        _dbContext.SaveChanges();
        return NoContent();
    }

    [HttpPost("demote/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Demote(string id)
    {
        IdentityRole role = _dbContext.Roles.SingleOrDefault(r => r.Name == "Admin");

        IdentityUserRole<string> userRole = _dbContext.UserRoles.SingleOrDefault(ur =>
            ur.RoleId == role.Id && ur.UserId == id
        );

        _dbContext.UserRoles.Remove(userRole);
        _dbContext.SaveChanges();
        return NoContent();
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        UserProfile user = _dbContext
            .UserProfiles.Include(up => up.IdentityUser)
            .SingleOrDefault(up => up.Id == id);

        if (user == null)
        {
            return NotFound();
        }
        user.Email = user.IdentityUser.Email;
        user.UserName = user.IdentityUser.UserName;
        user.Roles = _dbContext
            .UserRoles.Where(ur => ur.UserId == user.IdentityUser.Id)
            .Select(ur => _dbContext.Roles.FirstOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList();
        return Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("deactivate/{id}")]
    public IActionResult DeactivateUser(int id)
    {
        var user = _dbContext.UserProfiles.Find(id);
        if (user == null)
        {
            return NotFound();
        }

        user.IsActive = false;
        _dbContext.SaveChanges();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("reactivate/{id}")]  
    public IActionResult ReactivateUser(int id)
    {
        var user = _dbContext.UserProfiles
            .Include(up => up.IdentityUser)
            .FirstOrDefault(up => up.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        user.IsActive = true;
        _dbContext.SaveChanges();

        return NoContent();
    }

}
