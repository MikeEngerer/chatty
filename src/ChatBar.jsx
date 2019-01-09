import React, {Component} from 'react';

class ChatBar extends Component {

	render() {
		const onEnter = (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				const message = e.target.value;
				return this.props.addNewMessage(message);
			}
			console.log(e.key)
		}
		return (<footer className="chatbar">
				  <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.currentUser.name}/>
				  <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={onEnter}/>
				</footer>)
	}
}


export default ChatBar