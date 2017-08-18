import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoginForm from '../components/widgets/Form/LoginForm';
import LoadingOverlay from '../components/widgets/LoadingOverlay';
import {AccountActions} from '../actions';

class LoginPage extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			sendingRequest: false,
			error: ""
		};

		this.login = this.login.bind(this);
	}

	componentWillMount() {
		if(localStorage.getItem('Token')){
			this.context.router.push('/search');
		}
	}	

	login(data) {
		let _this = this;
		this.setState({
			sendingRequest: true
		}, ()=> {
	        this.props.login({
	            data: data,
	            cb: () => {
	                this.setState({
	                	sendingRequest: false
	                });
	                if(this.props.error !== null) {
	                	// Error
	                	this.setState({
	                		error: this.props.error.error_description
	                	});
	                }else {
	                	// Set cookies
	                	let access_token = this.props.userData.access_token;
	                	let token_type= this.props.userData.token_type;
	                	localStorage.setItem('username', data.Username);
						localStorage.setItem('Token', access_token);
                        localStorage.setItem('Token_Type', token_type);
						_this.context.router.push('/search');
	                }
	            }
	        });
	    });
	}

	render() {
		let overlayClass = (this.state.sendingRequest) ? 'rcomui-overlay show' : 'rcomui-overlay';
		return (
			<div className="layout">
                <LoadingOverlay
                    overlayClass={overlayClass}
                    message="Please wait..."
                />	
				<div className="wrapper no-sidebar">
					<section>
						<div className="content-wrapper">                            
							<div className="block-center mt-xl wd-xl">
								<div className="panel panel-dark panel-flat login-wrapper">
									<div className="panel-heading">
										Sign In To Continue
									</div>
									<div className="panel-body">
										<LoginForm
											sendingRequest={this.state.sendingRequest}
											error={this.state.error}
											login={(v)=>this.login(v)}/>										
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

LoginPage.contextTypes = {
	router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userData: state.AccountReducer.userData,
        error: state.AccountReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (req) => {
            dispatch(AccountActions.login(req.data, req.cb));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);