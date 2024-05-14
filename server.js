const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8001 });

let messages = []; // メッセージを保存するための配列

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (e) {
      parsedMessage = message;
    }
    messages.push(parsedMessage);
  });

  // 接続時にすべてのメッセージをクライアントに送信
  messages.forEach((message) => {
    ws.send(JSON.stringify({ type: "message", message: message }));
  });
});

console.log("WebSocket server is running on ws://localhost:8001");
