import React, {Component} from 'react';
import Filter from 'bad-words';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {
  constructor() {
    super();
    // set initial state --userColor & filter ideally should be contained in currentUser, needs refactoring (wip)
    this.state = {
      userColor: null,
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
      console.log('new WebSocket opened')
    }
    // on new msg broadcasted from server, set state with new msg
    this.socket.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data)
      // checks state of prof. filter and mutates message content if true
      parsedMessage.content = this.applyProfanityFilter(parsedMessage.content)
      // prepare new message data for state
      const oldMessages = this.state.messages,
            newMessages = [...oldMessages, parsedMessage],
            userCount = parsedMessage.count,
            /* userColor declaration only occurs on connection 
            since this function handles both new connections and new messages this checks if already set */
            userColor = this.state.userColor || parsedMessage.userColor
      this.setState({userColor, userCount, messages: newMessages})
    }
  };
  // takes incoming new currentUser data from chatbar and sets state

  render() {
    // props set to variables for readability in return statement
    const currentUser = this.state.currentUser,
          messages = this.state.messages,
          handleNewMessage = this.handleNewMessage,
          handleNewUsername = this.handleNewUsername,
          userCount = this.state.userCount,
          toggleProfanityFilter = this.toggleProfanityFilter,
          filterStatus = this.state.filter
    // renders child components (messages, chat bar) + nav bar
    return (<div>
              <nav className="navbar">
                <a href="/" className="navbar-brand" >Chatty&nbsp;<i className="fas fa-comment"></i></a>
                <NavBar userCount={userCount}/>
              </nav>
              <MessageList messages={messages}/>
              <ChatBar 
                currentUser={currentUser} 
                handleNewUsername={handleNewUsername} 
                handleNewMessage={handleNewMessage}
                toggleProfanityFilter={toggleProfanityFilter}
              />
            </div>);
  };
  // if filter flag is true (default), message will be cleaned
  applyProfanityFilter(message) {
    const filter = new Filter;
    if (this.state.filter) {
      message = filter.clean(message)
    }
    return message;
  }
  // set filter state on/off (true/false)
  toggleProfanityFilter() {
    this.setState({filter: !this.state.filter})
  }
  // takes incoming username change, sends to server and sets state
  handleNewUsername(username) {
    const newUsername = {
      type: 'postNotification',
      oldName: this.state.currentUser.name || "anon",
      newName: username || "anon"
    };
    console.log("username changed to:", newUsername.newName)
    this.socket.send(JSON.stringify(newUsername))
    this.setState({currentUser: {name: username || "anon"}})
  };
  // takes incoming messages from ChatBar and sends to server
  handleNewMessage(message) {
    // if blank, do nothing (do not allow blank msgs)
    if (message) {
      const newMessage = {
        // username defaults to "anon" if not set
        type: 'postMessage',
        username: this.state.currentUser.name ? this.state.currentUser.name : "anon",
        content: message,
        userColor: this.state.userColor
      }
      this.socket.send(JSON.stringify(newMessage))
    }
  };
};

export default App;
