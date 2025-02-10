using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models;

public class Post
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
    public DateTime PublishDate { get; set; } = DateTime.Now;

    public bool Approved { get; set; } = false;

    [DataType(DataType.Url)]
    public string ImageUrl { get; set; }
    public UserProfile User { get; set; }
    public Category Category { get; set; }
    public List<PostTag> PostTags { get; set; }
    public List<Comment> Comments { get; set; }
    public List<PostReaction> PostReactions { get; set; }
}
