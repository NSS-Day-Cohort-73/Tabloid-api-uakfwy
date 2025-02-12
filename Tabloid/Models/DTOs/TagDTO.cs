using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class TagDTO
{
    public int Id { get; set; }

    [Required]
    public string TagName { get; set; }
    public List<PostTagDTO> PostTags { get; set; }
}
