import React, {Component} from 'react';

class NavBar extends Component {

	render() {
		const plural = this.props.userCount > 1 ? "s" : ""
		return <h4>{this.props.userCount} active user{plural}</h4>
	};
};

export default NavBar;