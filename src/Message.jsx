import React, {Component} from 'react';

class Message extends Component {
	render() {
		const type = this.props.messageData.type
		console.log(this.props)
		if (type === "incomingNotification") {
			return (<div className="message system">
			    		{this.props.messageData.content}
			  		</div>)
		} else if (type === "incomingMessage") {
			return (<div className="message">
				    	<span className="message-username">{this.props.messageData.username}</span>
				    	<span className="message-content">{this.props.messageData.content}</span>
				  	</div>);
		} else {
			<p>test</p>
		}
	};
};

export default Message;