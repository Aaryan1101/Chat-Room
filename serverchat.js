const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let users = {};

wss.on('connection', (ws) => {
  let username;

  ws.on('message', (message) => {
    const messageString = message.toString();
    console.log(`Received message: ${messageString}`);
  
    if (messageString.startsWith('join ')) {
      username = messageString.substring(5);
      users[username] = ws;
      broadcast(`**${username} has joined the chat**`, ws);
    } else if (username) {
      broadcast(`**${username}: ${messageString}`);
    } else {
      console.log('Error: Username not defined');
    }
  });
  

  ws.on('error', (error) => {
    console.log('Error occurred');
    console.log(error);
  });

  ws.on('close', () => {
    if (username) {
      broadcast(`**${username} has left the chat**`);
      delete users[username];
    }
  });
});

function broadcast(message, excludeWs) {
  console.log(`Broadcasting message: ${message}`);
  for (const user of Object.values(users)) {
    if (user !== excludeWs) { 
      user.send(message);
    } else { 
      user.send(`**You have joined the chat!**`);
    }
  }
}

console.log('Server started on port 8080');