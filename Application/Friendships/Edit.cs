using System;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Friendships
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Friendship Friendship { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Friendship).SetValidator(new FriendshipValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var friendship = await _context.Friendships
                    .FindAsync(request.Friendship.UserId, request.Friendship.FriendId);
                var reverseFriendship = await _context.Friendships
                    .FindAsync(request.Friendship.FriendId, request.Friendship.UserId);

                if (friendship == null || reverseFriendship == null) return Result<Unit>.Failure("Friendship relationship is inconsistent or not found");

                friendship.Status = request.Friendship.Status ?? friendship.Status;
                friendship.AcceptedAt = request.Friendship.AcceptedAt ?? friendship.AcceptedAt;

                reverseFriendship.Status = request.Friendship.Status ?? reverseFriendship.Status;
                reverseFriendship.AcceptedAt = request.Friendship.AcceptedAt ?? reverseFriendship.AcceptedAt;


                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to update friendship");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
