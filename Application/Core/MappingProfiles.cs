using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Application.Activities;
using Domain;
using Application.Activities.FootballActivities;
using System.Runtime.ExceptionServices;
using Application.Friendships;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                .FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));

            CreateMap<FootballActivity, FootballActivityDto>()
            .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName))
            .ForMember(d => d.Attendees, o => o.MapFrom(s => s.Attendees.Select(a => a.AppUser)))
            .ForMember(d => d.NumberOfPlayers, o => o.MapFrom(s => s.Attendees.Count));

            CreateMap<Friendship, FriendDto>()
                .ForMember(d => d.FriendId, o => o.MapFrom(s => s.FriendId))
                .ForMember(d => d.UserId, o => o.MapFrom(s => s.UserId))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Friend.UserName))
                .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.CreatedAt))
                .ForMember(d => d.AcceptedAt, o => o.MapFrom(s => s.AcceptedAt))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status));

            CreateMap<Friendship, FriendshipDto>()
                .ForMember(d => d.FriendId, o => o.MapFrom(s => s.FriendId))
                .ForMember(d => d.UserId, o => o.MapFrom(s => s.UserId))
                .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.CreatedAt))
                .ForMember(d => d.AcceptedAt, o => o.MapFrom(s => s.AcceptedAt))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status));
        }
    }
}