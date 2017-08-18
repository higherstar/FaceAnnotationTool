import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Canvas from '../../components/widgets/Canvas/index';
import './index.css';
class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
            note: 'None',
            images: ['/img/1.jpeg', '/img/2.jpg', '/img/3.jpg'],
			position: 0
        };
	}

	nextImage(){
		console.log('next image');
		this.setState({
			position: this.state.position + 1
		});
	}

	previousImage(){
		console.log('previous image');
        this.setState({
            position: this.state.position - 1
        });
	}

	render() {
		return (
			<div className="layout">
				<div className="wrapper no-sidebar">
					<div className="canvas_area">
						<Canvas
							images={this.state.images}
							position={this.state.position}/>
						<p className="note_area">
							{this.state.note}
						</p>
						<div className="row">
							<div className="col-md-6">
								<button className="btn btn-previous btn-block" onClick={this.previousImage}>Previous</button>
							</div>
							<div className="col-md-6">
								<button className="btn btn-green btn-block" onClick={this.nextImage}>Next</button>
							</div>
						</div>
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
