using System.ComponentModel.DataAnnotations;

namespace Tabloid.Models.DTOs;

public class UserProfileDTO
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; }

    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime CreateDateTime { get; set; }

    [DataType(DataType.Url)]
    [MaxLength(255)]
    public string ImageLocation { get; set; }

    public List<string> Roles { get; set; }
    public string IdentityUserId { get; set; }

    public string FullName
    {
        get { return $"{FirstName} {LastName}"; }
    }
}
