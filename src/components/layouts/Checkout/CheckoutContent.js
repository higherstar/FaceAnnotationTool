import React, { Component } from 'react';
import CheckoutForm from '../../widgets/Form/CheckoutForm';
import CONSTANTS from '../../../constants/Common';
import Timer from '../../widgets/Timer';

class CheckoutContent extends Component {
	render() {
		let monthNames = CONSTANTS.MONTH_NAMES;
		let weekNames = CONSTANTS.WEEK_NAMES;
		return (
			<div className="primary-content col-md-8 col-xs-12 col-sm-12">
				<div className="row">
					<div className="col-md-offset-0 col-md-12 col-xs-12 col-sm-12">
						<div className="page-header hidden-sm hidden-xs">
							<Timer 
								flag='checkout'
								gotoHome={this.props.gotoHome}/>
							{(this.props.preBookData.message) ? <div className="alert alert-warning" role="alert">{this.props.preBookData.message}</div> : ''}
							<h3>
								<span className="hidden-sm hidden-xs">{this.props.data.hotelName}</span>
								<small>
									Book your stay for <span className="stay-dates">{weekNames[new Date(this.props.data.checkIn).getDay()]}, {monthNames[new Date(this.props.data.checkIn).getUTCMonth()]} {new Date(this.props.data.checkIn).getUTCDate()} - {weekNames[new Date(this.props.data.checkOut).getDay()]}, {monthNames[new Date(this.props.data.checkOut).getUTCMonth()]} {new Date(this.props.data.checkOut).getUTCDate()}, <span className="stay-dates-nights">{new Date(this.props.data.checkOut).getDate()-new Date(this.props.data.checkIn).getDate()} Nights</span></span>
								</small>
							</h3>											
						</div>
						<CheckoutForm 
							ref="checkoutForm"
							data={this.props.data} 
							checkoutable={this.props.checkoutable}
							preBookData={this.props.preBookData} 
							handleCheckout={this.props.handleCheckout}/>
					</div>
				</div>
			</div>
		);
	}
}

export default CheckoutContent;
