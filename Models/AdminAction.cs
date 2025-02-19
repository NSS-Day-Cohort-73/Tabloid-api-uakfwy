using System.ComponentModel.DataAnnotations.Schema;

namespace Tabloid.Models;

public class AdminAction 
{
    public int Id { get; set; }
    public ActionType Type { get; set; }
    public int TargetUserId { get; set; }
    [ForeignKey("TargetUserId")]
    public UserProfile TargetUser { get; set; }
    public int InitiatorId { get; set; }
    [ForeignKey("InitiatorId")]
    public UserProfile Initiator { get; set; }
    public List<AdminActionVote> Votes { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public ActionStatus Status { get; set; } = ActionStatus.Pending;
}

public class AdminActionVote
{
    public int Id { get; set; }
    public int AdminActionId { get; set; }
    public AdminAction AdminAction { get; set; }
    public int AdminId { get; set; }
    [ForeignKey("AdminId")]
    public UserProfile Admin { get; set; }
    public bool IsApproved { get; set; }
    public DateTime VotedAt { get; set; } = DateTime.Now;
}

public enum ActionType {Promote, Demote }
public enum ActionStatus { Pending, Approved, Rejected}