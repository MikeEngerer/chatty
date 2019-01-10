// server.js

const express = require('express');
const WebSocket = require('ws')
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4')
// Set the port to 3001
const PORT = 3001;


// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.broadcast = (data) => {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send((data))
		}
	})
}

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    switch (parsedData.type) {
      case 'postNotification':
        const notification = {
          type: 'incomingNotification',
          username: parsedData.name,
          content: `${parsedData.oldName} changed their name to ${parsedData.newName}`,
          id: uuidv4()
        }
        wss.broadcast(JSON.stringify(notification));
        break;
      case 'postMessage':
        const messageData = parsedData;
        console.log(`User ${messageData.username} said ${messageData.content}`);
        messageData.id = uuidv4();
        messageData.type = 'incomingMessage';
        wss.broadcast(JSON.stringify(messageData));
        break;
    } 
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});