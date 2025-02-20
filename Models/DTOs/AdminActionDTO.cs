namespace Tabloid.Models.DTOs;

public class AdminActionDTO
{
    public int Id { get; set; }
    public string Type { get; set; }
    public string Status { get; set ;}
    public int TargetUserId { get; set; }
    public int InitiatorId { get; set; }
    public List<AdminActionVoteDTO> Votes { get; set; }


    public AdminActionDTO(AdminAction action)
    {
        Id = action.Id;
        Type = action.Type.ToString();
        Status = action.Status.ToString();
        TargetUserId = action.TargetUserId;
        InitiatorId = action.InitiatorId;
        Votes = action.Votes.Select(v => new AdminActionVoteDTO(v)).ToList();
    }
}

public class AdminActionVoteDTO 
{
    public int AdminId { get; set; }
    public bool IsApproved { get; set ;}

    public AdminActionVoteDTO(AdminActionVote vote)
    {
        AdminId = vote.AdminId;
        IsApproved = vote.IsApproved;
    }
}