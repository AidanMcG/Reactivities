
using Application.Activities.FootballActivities;
using Domain;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers.ActivityControllers
{
    [ApiController]
    [Route("api/footballactivities")]
    public class FootballActivityController : BaseAPIController
    {
        [HttpGet]
        public async Task<IActionResult> GetFootballActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFootballActivity(System.Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateFootballActivity(FootballActivity footballActivity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { FootballActivity = footballActivity }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditFootballActivity(System.Guid id, FootballActivity footballActivity)
        {
            footballActivity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { FootballActivity = footballActivity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFootballActivity(System.Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(System.Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}
