import React, {Component} from 'react';
import uuidv4 from 'uuid/v4'
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import messageData from './messageData.json';


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: messageData.currentUser,
      messages: messageData.messages 
    };
    this.addNewMessage = this.addNewMessage.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: uuidv4(), username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage);
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages});
    }, 3000);
  };

  addNewMessage(message) {
    const newId = uuidv4();
    const oldMessages = this.state.messages;
    const newMessage = {
      id: newId,
      username: this.state.currentUser.name ? this.state.currentUser.name : "Anon",
      content: message
    }
    const newMessages = oldMessages.concat(newMessage)
    this.setState({messages:newMessages})
  };

  render() {
    const currentUser = this.state.currentUser;
    const messages = this.state.messages;
    const addNewMessage = this.addNewMessage;
    return (<div>
    	<nav className="navbar">
		  <a href="/" className="navbar-brand">Chatty</a>
		</nav>
    	<MessageList messages={messages}/>
      	<ChatBar currentUser={currentUser} addNewMessage={addNewMessage}/>
      </div>
    );
  };
};
export default App;
