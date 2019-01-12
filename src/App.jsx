import React, {Component} from 'react';
import Filter from 'bad-words'
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import messageData from './messageData.json';
import NavBar from './NavBar.jsx';

class App extends Component {
  constructor() {
    super();
    // set initial state 
    this.state = {
      currentUser: {name: ''},
      userCount: null,
      messages: [],
      filter: true
    };
    // bind handlers -> send to children as props
    this.handleNewUsername = this.handleNewUsername.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.toggleProfanityFilter = this.toggleProfanityFilter.bind(this);
    this.applyProfanityFilter = this.applyProfanityFilter.bind(this);
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
      parsedMessage.content = this.applyProfanityFilter(parsedMessage.content)
      const oldMessages = this.state.messages;
      const newMessages = [...oldMessages, parsedMessage]
      const userCount = parsedMessage.count
      this.setState({userCount: userCount, messages: newMessages})
    }
  };
  // takes incoming new currentUser data from chatbar and sets state

  render() {
    // props set to variables for readability
    const currentUser = this.state.currentUser,
          messages = this.state.messages,
          handleNewMessage = this.handleNewMessage,
          handleNewUsername = this.handleNewUsername,
          userCount = this.state.userCount,
          applyProfanityFilter = this.applyProfanityFilter,
          toggleProfanityFilter = this.toggleProfanityFilter,
          filterStatus = this.state.filter
    // renders child components (messages, chat bar) + nav bar
    return (<div>
              <nav className="navbar">
                <a href="/" className="navbar-brand" >Chatty&nbsp;<i className="fas fa-comment"></i></a>
                <NavBar userCount={userCount}/>
              </nav>
              <MessageList messages={messages} applyProfanityFilter={applyProfanityFilter}/>
              <ChatBar 
                currentUser={currentUser} 
                handleNewUsername={handleNewUsername} 
                handleNewMessage={handleNewMessage}
                toggleProfanityFilter={toggleProfanityFilter}
              />
            </div>);
  };

  applyProfanityFilter(message) {
    const filter = new Filter;
    let filteredMessage;
    if (this.state.filter) {
      filteredMessage = filter.clean(message)
    } else {
      filteredMessage = message
    }
    return filteredMessage;
  }

  toggleProfanityFilter() {
    const filter = this.state.filter
    this.setState({filter: !filter})
  }

  handleNewUsername(username) {
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
    const match = message.match(/(?:giphy)$/)
    const type = match ? 'postGif' : 'postMessage'
    // if blank, do nothing
    if (message) {
      const newMessage = {
        // username defaults to "anon" if not set
        type: type,
        username: this.state.currentUser.name ? this.state.currentUser.name : "anon",
        content: message
      }
      this.socket.send(JSON.stringify(newMessage))
    }
  };
};

export default App;
