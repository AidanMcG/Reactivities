using System;
using Domain;
using FluentValidation;

namespace Application.Friendships
{
    public class FriendshipValidator : AbstractValidator<Friendship>
    {
        public FriendshipValidator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.FriendId).NotEmpty();
            RuleFor(x => x.Status).NotEmpty();
            RuleFor(x => x.CreatedAt).NotEmpty();
        }
    }
}
