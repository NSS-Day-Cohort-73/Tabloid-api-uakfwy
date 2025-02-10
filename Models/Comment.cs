using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models;

public class Comment
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }

    [Required]
    [MaxLength(250)]
    public string Body { get; set; }
    public DateTime DateSubmitted { get; set; } = DateTime.Now;
    public Post Post { get; set; }
    public UserProfile User { get; set; }
}
