using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.FootballActivities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public FootballActivity FootballActivity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.FootballActivity.Title).NotEmpty();
                RuleFor(x => x.FootballActivity.Description).NotEmpty();
                RuleFor(x => x.FootballActivity.Date).NotEmpty();
                RuleFor(x => x.FootballActivity.Category).NotEmpty();
                RuleFor(x => x.FootballActivity.City).NotEmpty();
                RuleFor(x => x.FootballActivity.Venue).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.FootballActivities.FindAsync(request.FootballActivity.Id);

                if (activity == null) return null;

                activity.Title = request.FootballActivity.Title;
                activity.Description = request.FootballActivity.Description;
                activity.Date = request.FootballActivity.Date;
                activity.Category = request.FootballActivity.Category;
                activity.City = request.FootballActivity.City;
                activity.Venue = request.FootballActivity.Venue;
                activity.isCancelled = request.FootballActivity.isCancelled;

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to update football activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}