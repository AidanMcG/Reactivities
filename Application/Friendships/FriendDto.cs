using System;

namespace Application.Friendships
{
    public class FriendDto
    {
        public string UserName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public string Status { get; set; }
        public string FriendId { get; set; }
        public string UserId { get; set; }
    }
}
