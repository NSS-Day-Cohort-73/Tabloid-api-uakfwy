using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class PostDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }

    [Required]
    [MaxLength(70)]
    public string Title { get; set; }

    [MaxLength(90)]
    public string SubTitle { get; set; }

    [Required]
    public string Body { get; set; }

    public int? CategoryId { get; set; }

    [Required]
    public DateTime PublishDate { get; set; }

    public bool Approved { get; set; }

    [DataType(DataType.Url)]
    public string ImageUrl { get; set; }
    public UserProfileDTO User { get; set; }
    public CategoryDTO Category { get; set; }
    public List<PostTagDTO> PostTags { get; set; }
    public List<CommentDTO> Comments { get; set; }
    public List<PostReactionDTO> PostReactions { get; set; }
}
