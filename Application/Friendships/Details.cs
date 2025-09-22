using System;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Friendships
{
    public class Details
    {
        public class Query : IRequest<Result<FriendDto>>
        {
            public string UserId { get; set; }
            public string FriendId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<FriendDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<FriendDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var friendship = await _context.Friendships
                    .FirstOrDefaultAsync(f => f.UserId == request.UserId && f.FriendId == request.FriendId);

                if (friendship == null)
                {
                    return Result<FriendDto>.Failure("Friendship not found");
                }

                var friendDto = _mapper.Map<FriendDto>(friendship);

                return Result<FriendDto>.Success(friendDto);
            }
        }
    }
}
