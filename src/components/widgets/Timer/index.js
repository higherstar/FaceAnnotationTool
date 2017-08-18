import React, {Component} from 'react';
import './_timer.css';
class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 900,
			minutes: '',
			seconds: ''
		};
		this.timer=setInterval(this.tick.bind(this), 1000);
	}
	componentWillUnmount(){
		clearInterval(this.timer);
	}
	tick(){
		this.setState({count: (this.state.count - 1)});
		let minutes = Math.floor(this.state.count / 60);
		let sec =this.state.count % 60;
		minutes = minutes < 10 ? '0'+ minutes : minutes;
		sec = sec < 10 ? '0' +sec : sec;
		this.setState({
			minutes: minutes,
			seconds: sec
		});
		if(this.state.count===0){
			this.props.gotoHome();
		}
	}
	startTimer(){
		clearInterval(this.timer);
		this.timer=setInterval(this.tick.bind(this), 1000);
	}
	stopTimer(){
		clearInterval(this.timer);
	}
	render() {
	    if (!this.props) {
	      return null;
	    }else{
	      	return (
		        <label>{(this.props.flag === 'checkout') ? 'You must complete booking within ' : 'Results will refresh in '}<span className="time">{this.state.minutes}:{this.state.seconds}</span> minutes.</label>
	      	);
	    }
  	}
}
export default Timer;