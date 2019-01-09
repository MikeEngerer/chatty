import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
	render() {
		return (
			<div>
			{
				this.props.messages.map((message) => <Message key={message.id} messageData={message}/>)
			}
				</div>);
	};
};


export default MessageList;