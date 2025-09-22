
namespace Domain
{
    public class GolfActivity : Activity
    {
        public GolfActivity() { }
        public override List<int> GetPlayerNumberOptions()
        {
            return Enumerable.Range(1, 15).ToList();
        }
    }
}