import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

const mapStateToProps = (state) => {
    return {
        // propertiesData: state.ResultsReducer.propertiesData,
        // error: state.ResultsReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
