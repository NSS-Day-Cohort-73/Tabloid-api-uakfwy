using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class PostReactionDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PostId { get; set; }
    public int ReactionId { get; set; }
    public UserProfileDTO User { get; set; }
    public PostDTO Post { get; set; }
    public ReactionDTO Reaction { get; set; }
}
