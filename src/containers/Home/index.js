import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Canvas from '../../components/widgets/Canvas/index';
import './index.css';
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
					<div className="canvas_area">
						<Canvas />
					</div>
					<div className="instruction_area">
						<h3 className="text-center">Instruction</h3>
						<img src="/img/instruction.png" />
						<h4>Click on the face pooints in this order</h4>
						<h4>Shortcuts:</h4>
						<h5>s : skip a point if it's not visible</h5>
						<h5>backspace: delete the last point</h5>
						<h5>enter: advance to the next image</h5>
					</div>
				</div>
			</div>
		);
	}
}

HomePage.contextTypes = {
	router: PropTypes.object.isRequired
};

export default HomePage;
