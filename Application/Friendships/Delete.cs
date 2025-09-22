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
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string UserName { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.UserName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _userAccessor = userAccessor;
                _context = context;
                _userManager = userManager;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Console.WriteLine($"Received username for deletion: {request.UserName}");
                if (request.UserName == null) return Result<Unit>.Failure("Failure no username provided");
                var currentUser = await _userManager.FindByNameAsync(_userAccessor.GetUsername());
                var friendUser = await _userManager.FindByNameAsync(request.UserName);

                
                Console.WriteLine($"Received username for deletion: {friendUser?.UserName}");
                Console.WriteLine($"Current user: {currentUser?.UserName}");

                if (friendUser == null) return Result<Unit>.Failure("Friendship not found");

                var friendship = await _context.Friendships.Where(x => x.UserId == currentUser.Id && x.FriendId == friendUser.Id).FirstOrDefaultAsync();
                var reverseFriendship = await _context.Friendships.Where(x => x.UserId == friendUser.Id && x.FriendId == currentUser.Id).FirstOrDefaultAsync(); 
                
                if (friendship == null && reverseFriendship == null) return Result<Unit>.Failure("Friendship not found");


                if (friendship != null) _context.Friendships.Remove(friendship);
                if (reverseFriendship != null) _context.Friendships.Remove(reverseFriendship);

                var result = await _context.SaveChangesAsync() > 0; //changes > 0 = true else false

                if (!result) return Result<Unit>.Failure("Failed to delete friendship");

                return Result<Unit>.Success(Unit.Value);  //returns nothing
            }
        }
    }
}
