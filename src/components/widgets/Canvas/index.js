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
        let app = new PIXI.Application(225, 400, {
            backgroundColor: 0xffffff
        });
        this.refs.container.appendChild(app.view);

        let container = new PIXI.Container();
        app.stage.addChild(container);

        const sprite = PIXI.Sprite.fromImage(Img);
        sprite.anchor.set(0.5);
        sprite.x = app.renderer.width / 2;
        sprite.y = app.renderer.height / 2;
        sprite.width = app.renderer.width;
        sprite.height = app.renderer.height;
        container.addChild(sprite);
    }

    render() {
        return (
            <div className="canvas-container" ref="container"></div>
        );
    }
}
