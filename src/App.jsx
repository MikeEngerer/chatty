import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import messageData from './messageData.json';


class App extends Component {
  constructor() {
    super();
    // set initial state 
    this.state = {
      currentUser: {name: ''},
      messages: [] 
    };
    // bind handlers for sending to children as props
    this.handleNewUsername = this.handleNewUsername.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    // connect new websocket
    this.socket = new WebSocket('ws://localhost:3001')
    // Log socket on open
    this.socket.onopen = () => {
      console.log('WebSocket connected', this.socket)
    }
    // on new msg broadcasted from server, set state with new msg
    this.socket.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data)
      const oldMessages = this.state.messages;
      const newMessages = oldMessages.concat(parsedMessage)
      this.setState({messages:newMessages})
    }
    // dummy new msg
    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   // Add a new message to the list of messages in the data store
    //   const newMessage = {id: 1, username: "Michelle", content: "Hello there!"};
    //   const messages = this.state.messages.concat(newMessage);
    //   // Update the state of the app component.
    //   // Calling setState will trigger a call to render() in App and all child components.
    //   this.setState({messages: messages});
    // }, 3000);
  };
  // takes incoming new currentUser data from chatbar and sets state
  handleNewUsername(username) {
    console.log(this.state)
    const newUsername = {
      type: 'postNotification',
      oldName: this.state.currentUser.name || "anon",
      newName: username || "anon"
    };
    console.log("username changed to:", newUsername.name)
    this.socket.send(JSON.stringify(newUsername))
    this.setState({currentUser: {name: username || "anon"}})
  };
  // takes incoming messages from ChatBar and sends to server
  handleNewMessage(message) {
    const newMessage = {
      // username defaults to "Anon" if not set
      type: 'postMessage',
      username: this.state.currentUser.name ? this.state.currentUser.name : "anon",
      content: message
    }
    this.socket.send(JSON.stringify(newMessage))
  };

  render() {
    // props set to variables for readability
    const currentUser = this.state.currentUser;
    const messages = this.state.messages;
    const handleNewMessage = this.handleNewMessage;
    const handleNewUsername = this.handleNewUsername;
    // renders child components (messages, chat bar) + nav bar
    return (<div>
              <nav className="navbar">
                <a href="/" className="navbar-brand">Chatty</a>
              </nav>
              <MessageList messages={messages}/>
              <ChatBar 
                currentUser={currentUser} 
                handleNewUsername={handleNewUsername} 
                handleNewMessage={handleNewMessage}
              />
            </div>);
  };
};

export default App;
