import React, {Component} from 'react';

class ChatBar extends Component {
	// Whenever focus is on username input and enter is pressed, app.js changes currentUser state via this handler
	handleNewUsernameOnEnter = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.props.handleNewUsername(event.target.value);
		}
	}
	/* Whenever focus is on msg input and enter is pressed,
	app.js sends new msg to server for id assignment and processing */
	handleNewMessageOnEnter = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.props.handleNewMessage(event.target.value);
			event.target.value = "";
		}
	}

	handleFilterToggle = () => {
		this.props.toggleProfanityFilter()
	}

	render() {
 		
		return (<footer className="chatbar">
				  <input
				  	className="chatbar-username" 
				  	placeholder="Your Name (Optional)"
				  	maxLength="30"
				  	defaultValue={this.props.currentUser.name} 
				  	onKeyPress={this.handleNewUsernameOnEnter}
				  />
				  <input 
				  	className="chatbar-message" 
				  	placeholder="Type a message and hit ENTER" 
				  	onKeyPress={this.handleNewMessageOnEnter}
				  />
				  <span className="chatbar-filter">
					  <label htmlFor="filter">Profanity filter &nbsp;
					  <input 
					  	className="chatbar-checkbox"
					  	type="checkbox"
					  	onClick={this.handleFilterToggle}
					  	name="filter"
					  	defaultChecked
					  />
						</label>
				  </span>
				 
				</footer>);
	};
};


export default ChatBar;