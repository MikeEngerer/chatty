import React, {Component} from 'react';

class ChatBar extends Component {

	usernameOnEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			this.props.handleNewUsername(e.target.value);
		}
	}

	contentOnEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			this.props.handleNewMessage(e.target.value);
			e.target.value = "";
		}
	}

	render() {
 
		return (<footer className="chatbar">
				  <input
				  	className="chatbar-username" 
				  	placeholder="Your Name (Optional)" 
				  	defaultValue={this.props.currentUser.name} 
				  	onKeyPress={this.usernameOnEnter}
				  />
				  <input 
				  	className="chatbar-message" 
				  	placeholder="Type a message and hit ENTER" 
				  	onKeyPress={this.contentOnEnter}
				  />
				</footer>);
	};
};


export default ChatBar;