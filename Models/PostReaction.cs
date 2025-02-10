using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models;

public class PostReaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PostId { get; set; }
    public int ReactionId { get; set; }
    public UserProfile User { get; set; }
    public Post Post { get; set; }
    public Reaction Reaction { get; set; }
}
