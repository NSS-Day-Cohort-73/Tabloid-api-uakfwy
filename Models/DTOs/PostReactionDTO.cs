using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class PostReactionDTO
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public int PostId { get; set; }
    public int ReactionId { get; set; }
    public UserProfileDTO UserProfile { get; set; }
    public PostDTO Post { get; set; }
    public ReactionDTO Reaction { get; set; }
}
