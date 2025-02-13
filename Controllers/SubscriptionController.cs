using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabloid.Data;
using Tabloid.Models;
using Tabloid.Models.DTOs;

namespace Tabloid.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionController : ControllerBase
{
    private TabloidDbContext _dbContext;

    public SubscriptionController(TabloidDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet("userId")]
    [Authorize]
    public IActionResult GetSubscriptionsForCurrentUser(int userId)
    {
        return Ok(
            _dbContext
                .Subscriptions.Where(s => s.SubscriberId == userId)
                .Select(s => new SubscriptionDTO
                {
                    Id = s.Id,
                    AuthorId = s.AuthorId,
                    SubscriberId = s.SubscriberId,
                    BeginDate = s.BeginDate,
                })
        );
    }

    [HttpPost]
    [Authorize]
    public IActionResult PostSubscription(SubscriptionDTO subscriptionDTO)
    {
        Subscription subscriptionToAdd = new Subscription
        {
            AuthorId = subscriptionDTO.AuthorId,
            SubscriberId = subscriptionDTO.SubscriberId,
        };

        _dbContext.Subscriptions.Add(subscriptionToAdd);
        _dbContext.SaveChanges();

        return Created($"/api/subscription/{subscriptionToAdd.Id}", subscriptionToAdd);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteSubscription(int id)
    {
        var subscription = _dbContext.Subscriptions.FirstOrDefault(s => s.Id == id);

        if (subscription == null)
        {
            return NotFound();
        }

        _dbContext.Subscriptions.Remove(subscription);
        _dbContext.SaveChanges();

        return NoContent();
    }
}
