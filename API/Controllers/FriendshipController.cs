
using Application.Friendships;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/friendship")]
    public class FriendshipController : BaseAPIController
    {
        /*[HttpGet]
        public async Task<IActionResult> GetFriendship(string userId, string friendId)
        {
            return HandleResult(await Mediator.Send(new Details.Query { UserId = userId, FriendId = friendId }));
        }*/

        [HttpGet]
        public async Task<IActionResult> GetFriendships()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpPost]
        public async Task<IActionResult> CreateFriendship(FriendDto friendship)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Friendship = friendship }));
        }

        [HttpPut]
        public async Task<IActionResult> EditFriendship(Friendship friendship)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Friendship = friendship }));
        }

        [HttpDelete("{userName}")]
        public async Task<IActionResult> DeleteFriendship(string userName)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { UserName = userName }));
        }

    }
}