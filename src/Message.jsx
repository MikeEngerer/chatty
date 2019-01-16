import React, {Component} from 'react';

class Message extends Component {
	render() {
		// user color differs in each message and style is set accordingly
		const setColor = {color: this.props.messageData.userColor};
		const type = this.props.messageData.type
		const img = this.props.messageData.content.match(/(?:png|jpg)$/)
		// messages are displayed with different styles depend on type
		if (type === "incomingNotification") {
			return (<div className="message system">
			    		{this.props.messageData.content}
			  		</div>)
		} else if (type === "incomingMessage") {
			return (<div className="message">
				    	<span className="message-username" style={setColor}>{this.props.messageData.username}</span>
				    	{/* if message content ends in jpg or png, content will be rendered in an img element 
				    	(should be more specific to match full URLs as well as allow text content in same msg (wip))*/}
				    	{ img ? 
				    		<img className="image" src={this.props.messageData.content} /> :
				    		<span className="message-content">{this.props.messageData.content}</span>
				    	}
				  	</div>);
		}
	}
};

export default Message;