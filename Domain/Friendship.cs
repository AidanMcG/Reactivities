using System;

namespace Domain
{
    public class Friendship
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }

        public string FriendId { get; set; }
        public AppUser Friend { get; set; }

        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
    }
}
