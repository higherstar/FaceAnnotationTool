import React, { Component, PropTypes } from 'react';
import CancelForm from '../../widgets/Form/CancelForm';

class CancelContent extends Component {

	constructor(props) {
		super(props);
		this.gotoHome = this.gotoHome.bind(this);
	}

	gotoHome(){
		this.context.router.push('/');
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12 col-xs-12 col-sm-12">
						<div className="page-header cancel-title">
							<h2>
								Search Existing Reservation
								<button type="button" className="btn btn-red btn-lg" onClick={this.gotoHome}><i className="fa fa-home" aria-hidden="true"></i>&nbsp;Back to Home</button>	
							</h2>											
						</div>
					</div>
				</div>
				<CancelForm handlePreCancel={this.props.handlePreCancel} resultData={this.props.resultData} goCancelBooking={this.props.goCancelBooking}/>
			</div>
		);
	}
}
CancelContent.contextTypes = {
	router: PropTypes.object.isRequired
};
export default CancelContent;
