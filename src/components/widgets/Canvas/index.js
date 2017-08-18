import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_canvas.css';

let PIXI = require('pixi.js');
let cls;

export default class Canvas extends Component {
    static propTypes = {
        images: PropTypes.array.isRequired,
        position: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            container: null,
            points: [],
            width: 225,
            height: 400
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
        const Img = new Image();
        Img.src = this.props.images[this.props.position];
        Img.onload = () => {
            const sprite = PIXI.Sprite.fromImage(Img.src);
            sprite.anchor.set(0.5);
            sprite.x = cls.state.width / 2;
            sprite.y = cls.state.height / 2;
            sprite.width = cls.state.width;
            sprite.height = cls.state.height;

            // add user interactive event
            sprite.interactive = true;
            sprite.on('pointerdown', cls.onClick);

            // add image to the canvas
            container.addChild(sprite);

            this.setState({
                container: container,
                width: app.renderer.width,
                height: app.renderer.height
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.position !== this.props.position) {
            let container = cls.state.container;
            while (container.children[0]) {
                container.removeChild(container.children[0]);
            }

            // add default image to the canvas
            const Img = new Image();
            Img.src = nextProps.images[nextProps.position];
            Img.onload = () => {
                const sprite = PIXI.Sprite.fromImage(Img.src);
                sprite.anchor.set(0.5);
                sprite.x = cls.state.width / 2;
                sprite.y = cls.state.height / 2;
                sprite.width = cls.state.width;
                sprite.height = cls.state.height;

                // add user interactive event
                sprite.interactive = true;
                sprite.on('pointerdown', cls.onClick);

                // add image to the canvas
                container.addChild(sprite);
                this.setState({
                    container: container,
                    count: 0,
                    points: []
                });
            };
        }
    }

    // mouse click event on canvas
    onClick(e) {
        if (cls.state.count === 8) {
            return;
        }

        // get current clicked position
        this.data = e.data;
        const curPos = this.data.getLocalPosition(this.parent);

        // add pointers to image
        if (curPos.x > 10 && curPos.x < cls.state.width - 10
            && curPos.y > 10 && curPos.y < cls.state.height - 10) {
            cls.addPointer(curPos);
        }
    };

    // add pointer to the mouse clicked position
    addPointer(pos) {
        // draw a circle
        let graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x00FF00);
        graphics.beginFill(0xFFFFFF, 0);
        graphics.drawCircle(pos.x, pos.y, 4);
        graphics.endFill();
        this.state.container.addChild(graphics);

        // add text
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 12,
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
