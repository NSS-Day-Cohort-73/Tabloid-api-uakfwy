using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class CreateCommentDTO
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserProfileId { get; set; }

    [Required]
    [MaxLength(250)]
    public string Body { get; set; }
    public DateTime DateSubmitted { get; set; }
}
