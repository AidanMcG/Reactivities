using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.FootballActivities
{
    public class Create
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
                /*RuleFor(x => x.FootballActivity.Description).NotEmpty();
                RuleFor(x => x.FootballActivity.Date).NotEmpty();
                RuleFor(x => x.FootballActivity.Category).NotEmpty();
                RuleFor(x => x.FootballActivity.City).NotEmpty();
                RuleFor(x => x.FootballActivity.Venue).NotEmpty();*/
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                /*var activity = new FootballActivity
                {
                    Id = request.FootballActivity.Id,
                    Title = request.FootballActivity.Title,
                    Date = request.FootballActivity.Date,
                    Description = request.FootballActivity.Description,
                    Category = request.FootballActivity.Category,
                    City = request.FootballActivity.City,
                    Venue = request.FootballActivity.Venue,
                    NumberOfPlayers = request.FootballActivity.NumberOfPlayers,
                    isCancelled = request.FootballActivity.isCancelled
                };*/

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.FootballActivity,
                    IsHost = true
                };

                request.FootballActivity.Attendees.Add(attendee);

                _context.FootballActivities.Add(request.FootballActivity);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create football activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}