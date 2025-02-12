using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class CreateCategoryDTO
{
    [Required]
    public string CategoryName { get; set; }
}
