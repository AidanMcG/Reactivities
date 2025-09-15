
namespace Domain
{
    public class FootballActivity : Activity
    {
        public FootballActivity() { }
        public override List<int> GetPlayerNumberOptions()
        {
            return new List<int> { 10, 12, 14, 16, 18, 20, 22 };
        }
    }
}