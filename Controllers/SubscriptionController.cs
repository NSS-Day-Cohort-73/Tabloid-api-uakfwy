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

    [HttpGet("{userId}/{authorId}")]
    [Authorize]
    public IActionResult GetSubscriptionStatus(int userId, int authorId)
    {
        var subscription = _dbContext.Subscriptions.FirstOrDefault(s =>
            s.SubscriberId == userId && s.AuthorId == authorId
        );

        if (subscription == null)
        {
            return Ok(false);
        }

        return Ok(true);
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
        var subscription = _dbContext.Subscriptions.SingleOrDefault(s => s.SubscriberId == id);

        if (subscription == null)
        {
            return NotFound();
        }

        _dbContext.Subscriptions.Remove(subscription);
        _dbContext.SaveChanges();

        return NoContent();
    }
}
