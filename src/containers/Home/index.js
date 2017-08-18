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
			position: 0,
			button_type: 's'
        };
		this.gotoSkip = this.gotoSkip.bind(this);

	}

    componentWillMount() {
        document.addEventListener("keydown", this.handleEscKey, false);
        if(this.state.button_type === 's'){
            console.log('clicked s');
        }
    }

﻿	componentWillUnmount() {
        document.removeEventListener("keydown", this.handleEscKey, false);
    }

    handleEscKey(event){
        switch (event.code){
        	case 'KeyS':
        		console.log('Clicked S key');
        		break;
           case 'Enter':
               console.log('Clicked Enter key');
               break;
            case 'Backspace':
                console.log('Clicked Backspace key');
                break;
        }
    }

    gotoSkip() {
		console.log('clicked skip');
	}

	// select next image
	nextImage = () => {
		this.setState({
			position: this.state.position + 1
		});
	};

	// select previous image
	previousImage = () => {
        this.setState({
            position: this.state.position - 1
        });
	};

	render() {
		return (
			<div className="layout">
				<div className="wrapper no-sidebar">
					<div className="canvas_area">
						<Canvas
							images={this.state.images}
							position={this.state.position} />

						<p className="note_area">
							{this.state.note}
						</p>

						<div className="row">
							<div className="col-md-6">
								<button
									className="btn btn-previous btn-block"
									onClick={this.previousImage}
									disabled={this.state.position === 0}
								>
									Previous
								</button>
							</div>

							<div className="col-md-6">
								<button
									className="btn btn-green btn-block"
									onClick={this.nextImage}
									disabled={this.state.position === this.state.images.length - 1}
								>
									Next
								</button>
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
