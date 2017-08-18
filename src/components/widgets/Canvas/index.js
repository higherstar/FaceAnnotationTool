import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_canvas.css';
import Img from './download.jpeg';

let PIXI = require('pixi.js');

export default class Canvas extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);

        this.state = {
            count: 0,
        }
    }

    componentDidMount() {
        // create Pixi canvas and container
        let app = new PIXI.Application(800, 450, {
            backgroundColor: 0xffffff
        });
        this.refs.container.appendChild(app.view);

        let container = new PIXI.container();
        app.stage.addChild(container);
    }

    render() {
        return (
            <div className="canvas-container" ref="container"></div>
        );
    }
}
