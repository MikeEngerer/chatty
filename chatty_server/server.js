// server.js

const express = require('express');
const WebSocket = require('ws')
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4')
const fetch = require('node-fetch')
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
  const togglePlural = wss._server._connections > 1 ? "s" : "";
  const isOrAre = wss._server._connections > 1 ? "are" : "is";
  const newConnection = {
    type: 'incomingNotification',
    content: `New user connected! There ${isOrAre} now ${wss._server._connections} active user${togglePlural}.`,
    count: wss._server._connections,
    id: uuidv4()
  }
  console.log('Client connected, count:', wss._server._connections)
  wss.broadcast(JSON.stringify(newConnection))

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    switch (parsedData.type) {
      case 'postNotification':
        const notification = {
          type: 'incomingNotification',
          username: parsedData.name,
          count: wss._server._connections,
          content: `${parsedData.oldName} changed their name to ${parsedData.newName}`,
          id: uuidv4()
        }
        wss.broadcast(JSON.stringify(notification));
        break;
      case 'postMessage':
        const messageData = {
          id: uuidv4(),
          type: 'incomingMessage',
          count: wss._server._connections,
          username: parsedData.username,
          content: parsedData.content
        }
        console.log(`User ${messageData.username} said ${messageData.content}`);
        wss.broadcast(JSON.stringify(messageData));
        break;
      case 'postGif':
        const displayImg = {
          id: uuidv4(),
          type: 'incomingGif',
          count: wss._server._connections,
          content: handleUrl(parsedData.content)
        }
        wss.broadcast(JSON.stringify(displayImg));
        break;
    } 
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected', wss._server._connections)
    const togglePlural = wss._server._connections > 1 ? "s" : "";
    const isOrAre = wss._server._connections > 1 ? "are" : "is";
    const disconnect = {
      type: 'incomingNotification',
      content: `A user has disconnected. There ${isOrAre} now ${wss._server._connections} active user${togglePlural}.`,
      count: wss._server._connections,
      id: uuidv4()
    }
    wss.broadcast(JSON.stringify(disconnect))
  })

});

function handleUrl(url) {
  console.log("recieved new link:", url);
  let content;
  fetch(url)
    .then(res => res.json())
    .then(json => console.log(json))
}
