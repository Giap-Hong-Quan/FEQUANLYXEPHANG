import * as signalR from "@microsoft/signalr";

class SignalRService {
  private static instance: SignalRService;
  public connection: signalR.HubConnection;

  private constructor() {
    const base = process.env.REACT_APP_API_URL; // remove trailing /
  this.connection = new signalR.HubConnectionBuilder()
    .withUrl(`${base}hubs/queue`, {
          accessTokenFactory: async () => {
              return localStorage.getItem("token")||""; // Fetch JWT token from localStorage
          },
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
          skipNegotiation:false
          })
    .withAutomaticReconnect()
    .build();
  }

  static getInstance() {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  async startConnection() {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.connection.start();
        console.log("SignalR connected");
      }
    } catch (error) {
      console.error("Error starting SignalR connection:", error);
      setTimeout(() => this.startConnection(), 5000); // Retry on failure
    }
  }

  stopConnection() {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      this.connection.stop();
    }
  }
}

export default SignalRService;
