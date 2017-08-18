import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			propertiesData: []
		};

        this.gotoCancel = this.gotoCancel.bind(this);
	}

    gotoCancel(){
        this.context.router.push('/cancel');
    }

	render() {
		return (
			<div className="layout">
				<div className="wrapper no-sidebar">
				</div>
			</div>
		);
	}
}

HomePage.contextTypes = {
	router: PropTypes.object.isRequired
};

export default HomePage;
