using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Friendships
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public FriendDto Friendship { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Friendship.UserName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request.Friendship.UserName == null) return Result<Unit>.Failure("Failure no username provided");
                var currentUser = await _userManager.FindByNameAsync(_userAccessor.GetUsername());
                var friendUser = await _userManager.FindByNameAsync(request.Friendship.UserName);
                if (friendUser == null) return Result<Unit>.Failure("Friend user not found");

                var friendship = new Friendship
                {
                    UserId = currentUser.Id,
                    FriendId = friendUser.Id,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    AcceptedAt = null
                };

                var existingFriendship = await _context.Friendships
                    .FindAsync(friendship.UserId, friendship.FriendId);
                var existingFriendshipReverse = await _context.Friendships
                    .FindAsync(friendship.FriendId, friendship.UserId);

                if (existingFriendship != null || existingFriendshipReverse != null)
                {
                    return Result<Unit>.Failure("Friendship already exists");
                }

                var reverseFriendship = new Friendship
                {
                    UserId = friendUser.Id,
                    FriendId = currentUser.Id,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    AcceptedAt = null
                };

                _context.Friendships.Add(friendship);
                _context.Friendships.Add(reverseFriendship);

                var result = await _context.SaveChangesAsync() > 0; //changes > 0 = true else false

                if (!result) return Result<Unit>.Failure("Failed to create friendship");

                return Result<Unit>.Success(Unit.Value);  //returns nothing
            }
        }
    }
}
