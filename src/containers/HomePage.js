import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Canvas from '../components/widgets/Canvas';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			propertiesData: []
		};
	}

	render() {
		return (
			<div className="layout">
				<div className="wrapper no-sidebar">
					<Canvas />
				</div>
			</div>
		);
	}
}

HomePage.contextTypes = {
	router: PropTypes.object.isRequired
};

export default HomePage;
