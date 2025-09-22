using System.Security.Claims;
using Application.Core;
using Application.Friendships;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
namespace Application.Friendships
{
    public class List
    {
        public class Query : IRequest<Result<List<FriendDto>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<List<FriendDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }

            public async Task<Result<List<FriendDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await _userManager.FindByNameAsync(_userAccessor.GetUsername());
                var friendships = await _context.Friendships
                    .Where(f => f.UserId == currentUser.Id)
                    .ToListAsync(cancellationToken);

                foreach (var friendship in friendships)
                {
                    Console.WriteLine("Friendship found: " + friendship.FriendId);
                    var friendUser = await _userManager.FindByIdAsync(friendship.FriendId);
                    friendship.Friend.UserName = friendUser.UserName;
                    Console.WriteLine("Friendship username: " + friendUser.UserName);
                }

                var friends = _mapper.Map<List<FriendDto>>(friendships);
                Console.WriteLine("Total friendships mapped: " + friends.Count);
                foreach (var friend in friends)
                {
                    Console.WriteLine("Mapped FriendDto: " + friend.UserName);
                }

                return Result<List<FriendDto>>.Success(friends);
            }
        }
    }
}