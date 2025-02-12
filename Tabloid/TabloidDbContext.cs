using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Tabloid.Models;

namespace Tabloid.Data;

public class TabloidDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostReaction> PostReactions { get; set; }
    public DbSet<PostTag> PostTags { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }

    public TabloidDbContext(DbContextOptions<TabloidDbContext> context, IConfiguration config)
        : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<IdentityRole>()
            .HasData(
                new IdentityRole
                {
                    Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                    Name = "Admin",
                    NormalizedName = "admin",
                },
                new IdentityRole
                {
                    Id = "8f7d3b2e-9c1a-4f6d-b5e8-a2d9c6f7m4n3",
                    Name = "Author",
                    NormalizedName = "author",
                }
            );

        modelBuilder
            .Entity<IdentityUser>()
            .HasData(
                new IdentityUser[]
                {
                    new IdentityUser
                    {
                        Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                        UserName = "Administrator",
                        Email = "admina@strator.comx",
                        PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                            null,
                            _configuration["AdminPassword"]
                        ),
                    },
                    new IdentityUser
                    {
                        Id = "d8d76512-74f1-43bb-b1fd-87d3a8aa36df",
                        UserName = "JohnDoe",
                        Email = "john@doe.comx",
                        PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                            null,
                            _configuration["AdminPassword"]
                        ),
                    },
                    new IdentityUser
                    {
                        Id = "a7d21fac-3b21-454a-a747-075f072d0cf3",
                        UserName = "JaneSmith",
                        Email = "jane@smith.comx",
                        PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                            null,
                            _configuration["AdminPassword"]
                        ),
                    },
                    new IdentityUser
                    {
                        Id = "c806cfae-bda9-47c5-8473-dd52fd056a9b",
                        UserName = "AliceJohnson",
                        Email = "alice@johnson.comx",
                        PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                            null,
                            _configuration["AdminPassword"]
                        ),
                    },
                    new IdentityUser
                    {
                        Id = "9ce89d88-75da-4a80-9b0d-3fe58582b8e2",
                        UserName = "BobWilliams",
                        Email = "bob@williams.comx",
                        PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                            null,
                            _configuration["AdminPassword"]
                        ),
                    },
                    new IdentityUser
                    {
                        Id = "d224a03d-bf0c-4a05-b728-e3521e45d74d",
                        UserName = "EveDavis",
                        Email = "Eve@Davis.comx",
                        PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                            null,
                            _configuration["AdminPassword"]
                        ),
                    },
                }
            );

        modelBuilder
            .Entity<IdentityUserRole<string>>()
            .HasData(
                new IdentityUserRole<string>[]
                {
                    new IdentityUserRole<string>
                    {
                        RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                        UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                    },
                    new IdentityUserRole<string>
                    {
                        RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                        UserId = "d8d76512-74f1-43bb-b1fd-87d3a8aa36df",
                    },
                    new IdentityUserRole<string>
                    {
                        RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                        UserId = "a7d21fac-3b21-454a-a747-075f072d0cf3",
                    },
                }
            );
        modelBuilder
            .Entity<UserProfile>()
            .HasData(
                new UserProfile[]
                {
                    new UserProfile
                    {
                        Id = 1,
                        IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                        FirstName = "Admina",
                        LastName = "Strator",
                        ImageLocation =
                            "https://robohash.org/numquamutut.png?size=150x150&set=set1",
                        CreateDateTime = new DateTime(2022, 1, 25),
                    },
                    new UserProfile
                    {
                        Id = 2,
                        FirstName = "John",
                        LastName = "Doe",
                        CreateDateTime = new DateTime(2023, 2, 2),
                        ImageLocation =
                            "https://robohash.org/nisiautemet.png?size=150x150&set=set1",
                        IdentityUserId = "d8d76512-74f1-43bb-b1fd-87d3a8aa36df",
                    },
                    new UserProfile
                    {
                        Id = 3,
                        FirstName = "Jane",
                        LastName = "Smith",
                        CreateDateTime = new DateTime(2022, 3, 15),
                        ImageLocation =
                            "https://robohash.org/molestiaemagnamet.png?size=150x150&set=set1",
                        IdentityUserId = "a7d21fac-3b21-454a-a747-075f072d0cf3",
                    },
                    new UserProfile
                    {
                        Id = 4,
                        FirstName = "Alice",
                        LastName = "Johnson",
                        CreateDateTime = new DateTime(2023, 6, 10),
                        ImageLocation =
                            "https://robohash.org/deseruntutipsum.png?size=150x150&set=set1",
                        IdentityUserId = "c806cfae-bda9-47c5-8473-dd52fd056a9b",
                    },
                    new UserProfile
                    {
                        Id = 5,
                        FirstName = "Bob",
                        LastName = "Williams",
                        CreateDateTime = new DateTime(2023, 5, 15),
                        ImageLocation =
                            "https://robohash.org/quiundedignissimos.png?size=150x150&set=set1",
                        IdentityUserId = "9ce89d88-75da-4a80-9b0d-3fe58582b8e2",
                    },
                    new UserProfile
                    {
                        Id = 6,
                        FirstName = "Eve",
                        LastName = "Davis",
                        CreateDateTime = new DateTime(2022, 10, 18),
                        ImageLocation =
                            "https://robohash.org/hicnihilipsa.png?size=150x150&set=set1",
                        IdentityUserId = "d224a03d-bf0c-4a05-b728-e3521e45d74d",
                    },
                }
            );
        modelBuilder
            .Entity<Reaction>()
            .HasData(
                new Reaction[]
                {
                    new Reaction
                    {
                        Id = 1,
                        Name = "Like",
                        Icon = "👍",
                    },
                    new Reaction
                    {
                        Id = 2,
                        Name = "Love",
                        Icon = "😘",
                    },
                    new Reaction
                    {
                        Id = 3,
                        Name = "Hate",
                        Icon = "🤬",
                    },
                    new Reaction
                    {
                        Id = 4,
                        Name = "Foolish",
                        Icon = "🤡",
                    },
                }
            );
        modelBuilder
            .Entity<Tag>()
            .HasData(
                new Tag[]
                {
                    new Tag { Id = 1, TagName = "#Tech" },
                    new Tag { Id = 2, TagName = "#Movies" },
                    new Tag { Id = 3, TagName = "#Gaming" },
                    new Tag { Id = 4, TagName = "#Travel" },
                    new Tag { Id = 5, TagName = "#Cooking" },
                    new Tag { Id = 6, TagName = "#HotTake" },
                }
            );
        modelBuilder
            .Entity<Category>()
            .HasData(
                new Category[]
                {
                    new Category { Id = 1, CategoryName = "Satire" },
                    new Category { Id = 2, CategoryName = "Entertainment" },
                    new Category { Id = 3, CategoryName = "Sports" },
                    new Category { Id = 4, CategoryName = "Informative" },
                    new Category { Id = 5, CategoryName = "Debate & Discussion" },
                }
            );
        modelBuilder
            .Entity<Post>()
            .HasData(
                new Post[]
                {
                    new Post
                    {
                        Id = 1,
                        UserId = 1,
                        Title = "I Want To Be",
                        SubTitle = "The Very Best",
                        Body =
                            @"Like no one ever was
                        To catch them is my real test
                        To train them is my cause
                        I will travel across the land
                        Searching far and wide
                        Teach Pokémon to understand
                        The power that's inside

                        (Pokémon
                        Gotta catch 'em all) It's you and me
                        I know it's my destiny (Pokémon)
                        Oh, you're my best friend
                        In a world we must defend (Pokémon
                        Gotta catch 'em all) A heart so true
                        Our courage will pull us through
                        You teach me and I'll teach you (Ooh, ooh)
                        Pokémon! (Gotta catch 'em all)
                        Gotta catch 'em all
                        Yeah",
                        CategoryId = 5,
                        PublishDate = new DateTime(2025, 2, 8),
<<<<<<< HEAD:Tabloid/TabloidDbContext.cs
                        ImageUrl = "https://occ-0-8407-114.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABf_vkYSzY2EsbRFAOJOS3_ZdreU4YoqzdzVZf-f1CEP9ndmI3705aHteXy3ZD7tLH4YbavoJT3lPK9luZDLgQxhQOBw1tLuBzxFG.jpg?r=b99",
                        Approved = true
            }
        });
        modelBuilder.Entity<PostReaction>().HasData(new PostReaction[]
        {
            new PostReaction { Id = 1, UserProfileId = 2, PostId = 1, ReactionId = 4 },
            new PostReaction { Id = 2, UserProfileId = 3, PostId = 1, ReactionId = 3} 
        });
        modelBuilder.Entity<PostTag>().HasData(new PostTag[]
        {
            new PostTag { Id = 1, PostId = 1, TagId = 6 },
            new PostTag { Id = 2, PostId = 1, TagId = 3 }
        });
        modelBuilder.Entity<Comment>().HasData(new Comment[]
        {
            new Comment
            {
                Id = 1,
                PostId = 1,
                UserProfileId = 2,
                Body = "Digimon is better #Tai&Augumon",
                DateSubmitted = new DateTime(2025, 2, 9)
            }
        });
        modelBuilder.Entity<Subscription>().HasData(new Subscription[]
        {
            new Subscription { Id = 1, AuthorId = 1, SubscriberId = 2, BeginDate = new DateTime(2025, 2, 9) }
        });
 
=======
                        ImageUrl =
                            "https://occ-0-8407-114.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABf_vkYSzY2EsbRFAOJOS3_ZdreU4YoqzdzVZf-f1CEP9ndmI3705aHteXy3ZD7tLH4YbavoJT3lPK9luZDLgQxhQOBw1tLuBzxFG.jpg?r=b99",
                        Approved = true,
                    },
                }
            );
        modelBuilder
            .Entity<PostReaction>()
            .HasData(
                new PostReaction[]
                {
                    new PostReaction
                    {
                        Id = 1,
                        UserId = 2,
                        PostId = 1,
                        ReactionId = 4,
                    },
                    new PostReaction
                    {
                        Id = 2,
                        UserId = 3,
                        PostId = 1,
                        ReactionId = 3,
                    },
                }
            );
        modelBuilder
            .Entity<PostTag>()
            .HasData(
                new PostTag[]
                {
                    new PostTag
                    {
                        Id = 1,
                        PostId = 1,
                        TagId = 6,
                    },
                    new PostTag
                    {
                        Id = 2,
                        PostId = 1,
                        TagId = 3,
                    },
                }
            );
        modelBuilder
            .Entity<Comment>()
            .HasData(
                new Comment[]
                {
                    new Comment
                    {
                        Id = 1,
                        PostId = 1,
                        UserId = 2,
                        Body = "Digimon is better #Tai&Augumon",
                        DateSubmitted = new DateTime(2025, 2, 9),
                    },
                }
            );
        modelBuilder
            .Entity<Subscription>()
            .HasData(
                new Subscription[]
                {
                    new Subscription
                    {
                        Id = 1,
                        AuthorId = 1,
                        SubscriberId = 2,
                        BeginDate = new DateTime(2025, 2, 9),
                    },
                }
            );

>>>>>>> develop:TabloidDbContext.cs
        //Configure the one-to-many relationship between Tags and PostTags (Cascade Delete)
        modelBuilder
            .Entity<PostTag>()
            .HasOne(pt => pt.Tag)
            .WithMany(t => t.PostTags)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<PostTag>()
            .HasOne(pt => pt.Post)
            .WithMany(p => p.PostTags)
            .OnDelete(DeleteBehavior.Cascade);

        //Cascade Delete for Post and PostReactions
        modelBuilder
            .Entity<PostReaction>()
            .HasOne(pr => pr.Post)
            .WithMany(p => p.PostReactions)
            .OnDelete(DeleteBehavior.Cascade);

        //Cascade Delete for Comments on a Post
        modelBuilder
            .Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<Category>()
            .HasMany(c => c.Posts)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
