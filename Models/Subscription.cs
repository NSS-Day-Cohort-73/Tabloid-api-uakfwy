using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tabloid.Models;

public class Subscription
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public int SubscriberId { get; set; }

    [Required]
    public DateTime BeginDate { get; set; } = DateTime.Now;

    [ForeignKey("AuthorId")]
    public UserProfile Author { get; set; }

    [ForeignKey("SubscriberId")]
    public UserProfile Subscriber { get; set; }
}
