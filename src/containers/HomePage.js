import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

const mapStateToProps = (state) => {
    return {
        propertiesData: state.ResultsReducer.propertiesData,
        error: state.ResultsReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
