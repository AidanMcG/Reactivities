using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.FootballActivities
{
    public class List
    {
        public class Query : IRequest<Result<List<FootballActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<FootballActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<FootballActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.FootballActivities
                    .ProjectTo<FootballActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<FootballActivityDto>>.Success(activities);
            }
        }
    }
}