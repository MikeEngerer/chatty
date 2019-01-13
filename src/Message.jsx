import React, {Component} from 'react';

class Message extends Component {
	render() {
		const setColor = {color: this.props.messageData.userColor};
		const type = this.props.messageData.type
		const img = this.props.messageData.content.match(/(?:png|jpg)$/)
		if (type === "incomingNotification") {
			return (<div className="message system">
			    		{this.props.messageData.content}
			  		</div>)
		} else if (type === "incomingMessage") {
			return (<div className="message">
				    	<span className="message-username" style={setColor}>{this.props.messageData.username}</span>
				    	{ img ? 
				    		<img className="image" src={this.props.messageData.content} /> :
				    		<span className="message-content">{this.props.messageData.content}</span>
				    	}
				  	</div>);
		} else if (type === "incomingGif") {
			return (<div className="gif">
				    	<span className="message-username">{this.props.messageData.username}</span>
				    	<span className="message-content">{this.props.messageData.content}</span>
				  	</div>);

		}
	}
};

export default Message;