using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class SubscriptionDTO
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public int SubscriberId { get; set; }

    [Required]
    public DateTime BeginDate { get; set; }

    public UserProfileDTO Author { get; set; }
    public UserProfileDTO Subscriber { get; set; }
}
