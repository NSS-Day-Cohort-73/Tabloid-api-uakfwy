using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
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
                .Select(up => new UserProfile
                {
                    Id = up.Id,
                    FirstName = up.FirstName,
                    LastName = up.LastName,
                    Email = up.IdentityUser.Email,
                    UserName = up.IdentityUser.UserName,
                    IdentityUserId = up.IdentityUserId,
                    Roles = _dbContext
                        .UserRoles.Where(ur => ur.UserId == up.IdentityUserId)
                        .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
                        .ToList(),
                })
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
    public IActionResult InitializeDemotion(string id, [FromQuery, Required] int currentUserId)
    {

        UserProfile currentUser = _dbContext.UserProfiles
            .Include(up => up.IdentityUser)
            .SingleOrDefault(up => up.Id == currentUserId);
        IdentityRole adminRole = _dbContext
            .Roles
            .SingleOrDefault(r => r.Name == "Admin");
        IdentityUserRole<string> currentUserRole = _dbContext
            .UserRoles
            .SingleOrDefault(ur => ur.RoleId == adminRole.Id && ur.UserId == currentUser.IdentityUserId);

        if (currentUser == null)
        {
            return NotFound("Current User does not exist");
        }
        //Checks if initiator has the role admin
        if (currentUserRole == null)
        {
            return Forbid();
        }

        //Finds the user to demote and checks if it exists or not
        UserProfile userToDemote = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == id);

        if (userToDemote == null)
        {
            return NotFound("That user does not exist");
        }    
        
        //Checks to see if that Action already exists
        AdminAction existingAction = _dbContext.AdminActions
            .FirstOrDefault(a => a.TargetUserId == userToDemote.Id && a.Type == ActionType.Demote && a.Status == ActionStatus.Pending);

        if (existingAction != null)
        {
            return BadRequest("A demotion request for this user is already pending.");
        }

        //Create a new demote action
        AdminAction action = new AdminAction 
        {
            Type = ActionType.Demote,
            TargetUserId = userToDemote.Id,
            InitiatorId = currentUserId
        };

        //Adds the vote to demote
        action.Votes.Add(new AdminActionVote 
        {
            AdminId = currentUserId,
            IsApproved = true
        });

        _dbContext.AdminActions.Add(action);
        _dbContext.SaveChanges();

        return Ok(new { message = "Demotion initiated, awaiting second admin approval", action = new AdminActionDTO(action)});

    }

    [HttpPost("demote/vote/{actionId}")]
    [Authorize (Roles = "Admin")]
    public IActionResult DemoteVote(int actionId, [FromQuery, Required] int currentUserId)
    {
        //finds the current action being voted on
        AdminAction action = _dbContext.AdminActions
            .Include(a => a.Votes)
            .SingleOrDefault(a => a.Id == actionId);

        if (action == null)
        {
            return NotFound("That action does not exist");
        }

        //find the voting admin and makes sure they exist, and that they are an admin
        UserProfile votingAdmin = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == currentUserId);

        IdentityRole adminRole = _dbContext
        .Roles
        .SingleOrDefault(r => r.Name == "Admin");
        
        IdentityUserRole<string> currentUserRole = _dbContext
        .UserRoles
        .SingleOrDefault(ur => ur.RoleId == adminRole.Id && ur.UserId == votingAdmin.IdentityUserId);

        if (votingAdmin == null)
        {
            return NotFound("That Admin does not exist");
        }

        if (currentUserRole == null)
        {
            return Forbid();
        }
        
        //Check to ensure voting admin hasn't already voted
        if (action.Votes.Any(v => v.AdminId == currentUserId))
        {
            return BadRequest("You have already voted on this action.");
        }

        action.Votes.Add( new AdminActionVote
        {
            AdminId = currentUserId,
            IsApproved = true
        });

        //Finds the user that is being demoted
        UserProfile userToDemote = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == action.TargetUserId);

        if (userToDemote == null)
        {
            return NotFound("User to demote doesn't exist.");
        }

        //Check if 2 votes have been cast
        if (action.Votes.Count >= 2)
        {
            //If action has 2 votes sets status of action to approved
            action.Status = ActionStatus.Approved;

            //Then finds the role and removes the relationship between admin role and admin user
            IdentityRole role = _dbContext.Roles.SingleOrDefault(r => r.Name == "Admin");


            IdentityUserRole<string> userRole = _dbContext.UserRoles.SingleOrDefault(ur =>
            ur.RoleId == role.Id && ur.UserId == userToDemote.IdentityUserId
        );

        _dbContext.UserRoles.Remove(userRole);
        _dbContext.SaveChanges();
        return NoContent();
        } 
        
        _dbContext.SaveChanges();
        return Ok(new {message = "Vote Recorded", action = new AdminActionDTO(action)});
    }

    [HttpGet("/pending/{userId}")]
    [Authorize(Roles = "Admin")]
    public IActionResult PendingActions(int userId)
    {
        AdminAction pendingActions = _dbContext
        .AdminActions
        .Include(a => a.Votes)
        .FirstOrDefault(a => a.TargetUserId == userId && a.Status == ActionStatus.Pending);

        if (pendingActions == null)
        {
            return NotFound("Current User has no pending actions");
        }

        return Ok(new AdminActionDTO(pendingActions));
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
}
