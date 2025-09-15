using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Application.Activities;
using Domain;
using Application.Activities.FootballActivities;

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
        }
    }
}