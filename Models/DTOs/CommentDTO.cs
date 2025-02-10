using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class CommentDTO
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }

    [Required]
    [MaxLength(250)]
    public string Body { get; set; }
    public DateTime DateSubmitted { get; set; }

    public PostDTO Post { get; set; }
    public UserProfileDTO User { get; set; }
}
