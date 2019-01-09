import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import messageData from './messageData.json';


class App extends Component {
  constructor() {
    super();
    // set initial state from JSON
    this.state = {
      currentUser: {name: ''},
      messages: [] 
    };
    this.handleNewUsername = this.handleNewUsername.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount <App />");

    this.socket = new WebSocket('ws://localhost:3001')
    this.socket.onopen = () => {
      console.log('WebSocket connected', this.socket)
    }

    this.socket.onmessage = (message) => {
      const oldMessages = this.state.messages;
      const newMessages = oldMessages.concat(JSON.parse(message.data))
      console.log(newMessages)
      this.setState({messages:newMessages})
    }

    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 1, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage);
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages});
    }, 3000);
  };

  handleNewUsername(username) {
    const newUsername = {
      name: username
    };
    console.log(newUsername)
    this.setState({currentUser:newUsername})
    console.log(this.state)
  };

  handleNewMessage(message) {
    const newMessage = {
      username: this.state.currentUser.name ? this.state.currentUser.name : "Anon",
      content: message
    }
    this.socket.send(JSON.stringify(newMessage))
  };

  render() {
    const currentUser = this.state.currentUser;
    const messages = this.state.messages;
    const handleNewMessage = this.handleNewMessage;
    const handleNewUsername = this.handleNewUsername;
    return (<div>
      <nav className="navbar">
      <a href="/" className="navbar-brand">Chatty</a>
    </nav>
      <MessageList messages={messages}/>
        <ChatBar currentUser={currentUser} handleNewUsername={handleNewUsername} handleNewMessage={handleNewMessage}/>
      </div>
    );
  };
};
export default App;
