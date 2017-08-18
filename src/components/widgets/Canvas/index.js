import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_canvas.css';
import Img from '../../../../public/img/download.jpeg';

let PIXI = require('pixi.js');
let cls;

export default class Canvas extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            container: null,
            points: []
        }
    }

    componentDidMount() {
        cls = this;

        // create PIXI canvas and container
        let app = new PIXI.Application(225, 400, {
            backgroundColor: 0xffffff
        });
        this.refs.container.appendChild(app.view);

        // create image container
        let container = new PIXI.Container();
        app.stage.addChild(container);

        // add default image to the canvas
        const sprite = PIXI.Sprite.fromImage(Img);
        sprite.anchor.set(0.5);
        sprite.x = app.renderer.width / 2;
        sprite.y = app.renderer.height / 2;
        sprite.width = app.renderer.width;
        sprite.height = app.renderer.height;

        // add user interactive event
        sprite.interactive = true;
        sprite.on('pointerdown', this.onClick);

        // add image to the canvas
        container.addChild(sprite);

        this.setState({
            container: container
        });
    }

    onClick(e) {
        if (cls.state.count === 8) {
            return;
        }

        // get current clicked position
        this.data = e.data;
        const curPos = this.data.getLocalPosition(this.parent);

        // add pointers to image
        if (curPos.x > 10 && curPos.y > 10) {
            cls.addPointer(curPos);
        }
    };

    addPointer(pos) {
        // draw a circle
        let graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x00FF00);
        graphics.beginFill(0xFFFFFF, 0);
        graphics.drawCircle(pos.x, pos.y, 5);
        graphics.endFill();
        this.state.container.addChild(graphics);

        // add text
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 10,
            fill: '#00ff00',
            stroke: '#00ff00'
        });
        const txt = new PIXI.Text(this.state.count + 1, style);
        txt.anchor.set(0.5);
        if (pos.x > 20) {
            txt.x = pos.x - 10;
        } else {
            txt.x = pos.x + 10;
        }
        txt.y = pos.y;
        this.state.container.addChild(txt);

        // update points
        let points = this.state.points;
        points.push({
            x: pos.x,
            y: pos.y
        });

        this.setState({
            count: this.state.count + 1,
            points: points
        });
    }

    render() {
        return (
            <div className="canvas-container" ref="container"></div>
        );
    }
}
