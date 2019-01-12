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
  const oneOrMore = wss._server._connections > 1 ? 
    `New user connected! There are now ${wss._server._connections} active users.` : 
    "Welcome! Its only you in here until others join.";
  const newConnection = {
    type: 'incomingNotification',
    content: oneOrMore,
    count: wss._server._connections,
    id: uuidv4(),
    userColor: assignColor()
  }
  console.log('Client connected, count:', wss._server._connections)
  wss.broadcast(JSON.stringify(newConnection))

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    switch (parsedData.type) {
      case 'postNotification':
        // data object for system message
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
        // data object for user message
        const messageData = {
          id: uuidv4(),
          type: 'incomingMessage',
          count: wss._server._connections,
          username: parsedData.username,
          content: parsedData.content,
          userColor: parsedData.userColor
        }
        console.log(`User ${messageData.username} said ${messageData.content}`);
        wss.broadcast(JSON.stringify(messageData));
        break;
      case 'postGif':
        // data obj for GIF message (wip)
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
    const oneOrMore = wss._server._connections > 1 ? 
      `There are now ${wss._server._connections} active users.` : 
      "It's just you left in here. :("
    const disconnect = {
      type: 'incomingNotification',
      content: `A user has disconnected. ${oneOrMore}`,
      count: wss._server._connections,
      id: uuidv4()
    }
    wss.broadcast(JSON.stringify(disconnect))
  })

});

function handleUrl(url) {
  console.log("recieved new gif:", url);
  let content;
  fetch(url)
    .then(res => res.json())
    .then(json => console.log(json))
}

function assignColor() {
 const colors = ['#50c8b4', '#2f4558', '#50c878', '#bdf8d1']
 const random = Math.floor(Math.random() * Math.floor(3))
 return colors[random]
}
