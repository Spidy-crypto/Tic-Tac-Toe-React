import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
const SOCKET_URL = "http://localhost:8080/webSocket";

class Socket {
  constructor() {
    this.socket = new SockJS(SOCKET_URL);
    this.stompClient = Stomp.over(this.socket);
  }

  connect(changeMove, messages, setMessages, gameId) {
    if (!this.stompClient.connected) {
      this.stompClient.connect({}, (frame) => {
        this.stompClient.subscribe("/topic/move/" + gameId, (data) => {
          changeMove(JSON.parse(data.body));
        });
        this.stompClient.subscribe("/topic/message/" + gameId, (data) => {
          let arr = [...messages];
          arr.push(data.body);
          setMessages(arr);
        });
      });
    }
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect(() => {
        console.log("disconnect");
      });
    }
  }
}

export default Socket;
