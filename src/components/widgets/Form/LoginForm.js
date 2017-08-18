import React, { Component } from 'react';
import 'parsleyjs';
import $ from 'jquery';

class LoginPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Username: '',
			Password: '',
			RememberMe: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(type, e) {
		let state = this.state;
		state[type] = (type === "RememberMe") ? e.target.checked : e.target.value;
		this.setState(state);
	}

	handleSubmit(e) {		
		e.preventDefault();
		let form = $('#login-form').parsley();
		if(form.validate() === true) {			
			this.props.login(this.state);			
		}
	}

	render() {		
		return (			
			<form id="login-form" className="form-horizontal" onSubmit={this.handleSubmit}>
				<div className="form-group has-feedback">
					<input className="form-control" id="Username" placeholder="Enter username" type="text"  value={this.state.Username} onChange={this.handleChange.bind(this, 'Username')} data-parsley-required="true"/>
				</div>
				<div className="form-group has-feedback">
					<input className="form-control" id="Password" placeholder="Password" type="password" value={this.state.Password} onChange={this.handleChange.bind(this, 'Password')} data-parsley-required="true"/>
				</div>
				<div className="clearfix">
					<div className="checkbox c-checkbox pull-left mt0">
						<label>
							<input id="RememberMe" type="checkbox" value={this.state.RememberMe} onChange={this.handleChange.bind(this, 'RememberMe')}/>
							<span className="fa fa-check"></span><label htmlFor="RememberMe">Remember me?</label>
						</label>
					</div>    
				</div>
				<div className="form-group">
					{(this.props.error === '') ? '' : (<h3 className="error">Error: {this.props.error}</h3>)}
				</div>
				<button type="submit" className="btn btn-red btn-block mt-lg">Login</button>
			</form>
		);
	}
}

export default LoginPage;
