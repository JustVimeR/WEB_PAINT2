using Microsoft.AspNetCore.SignalR;

namespace WEB_PAINT2.Hubs
{
    public class DrawingBoardHub : Hub
    {
        public async Task SendDrawing(string data)
        {
            await Clients.Others.SendAsync("ReceiveDrawing", data);
        }

        public async Task ClearBoard()
        {
            await Clients.Others.SendAsync("BoardCleared");
        }
    }
}
