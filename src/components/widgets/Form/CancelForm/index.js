import React, { Component, PropTypes } from 'react';
import './_cancelForm.css';
import $ from 'jquery';
import numeral from 'numeral';
import moment from 'moment';

class CancelForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			code: ''		
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);	
		numeral.defaultFormat('$0,0.00');
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({
			search_hotel_name: "",
			submitted: true
		}, ()=> {
			if($(".has-error").length === 0) {
				this.props.handlePreCancel(this.state.code);
			}
		});
	}

	handleInputChange(type, e){
		let state = this.state;
		let value = e.target.value;
		state[type]=value;
		this.setState(state);
	}

	render() {
		let startDate = '';
		let endDate = '';
		let bookingIdGlyphIcon = '';
		let bookingIdFeedback = '';
		let bookingIdLabel='';
		let result = this.props.resultData;
		if(this.state.submitted === true) {
			if(this.state.code === ''){
				bookingIdGlyphIcon = 'remove';
				bookingIdFeedback = 'has-error';
				bookingIdLabel = 'Please enter a valid Itinerary / Confirmation Code.';
				
			}else {
				bookingIdGlyphIcon='ok';
				bookingIdFeedback='has-success';
				bookingIdLabel='';
			}
		}

		
		if(result !== null) {
			startDate = moment(result.checkin).format("MMMM D, YYYY");
			endDate = moment(result.checkout).format("MMMM D, YYYY");
		}

		return (
			<form className="form-horizontal" id="cancel-form" onSubmit={this.handleSubmit}>
				<div className="row">
					<div className={`col-md-offset-2 col-md-8 col-xs-12 col-sm-12 ${bookingIdFeedback}`}>
						<label className="sub-title text-left">Itinerary / Confirmation Code</label>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-offset-2 col-md-8 col-xs-12 col-sm-12 ${bookingIdFeedback}`}>
						<input type="text" placeholder="Code" className="form-control custom-input" value={this.state.code} onChange={this.handleInputChange.bind(this, 'code')} />
						<span className={`glyphicon form-control-feedback glyphicon-${bookingIdGlyphIcon}`} aria-hidden="true"></span>
						<label className="control-label validation_message" htmlFor="booking_id">{bookingIdLabel}</label>
					</div>
				</div>
				<div className="row">
					<div className="col-md-offset-8 col-md-2 col-xs-12 col-sm-12 align-right">
						<button type="submit" className="btn btn-red btn-lg">Search</button>
					</div>
				</div>

				{
					(result !== null) ? 
					(
						<div className="row stay-area" id="search_hotel_name">
							<div className="col-md-offset-2 col-md-8 col-xs-12 col-sm-12 align-left">
								<hr/>
								<p className="sub-title">Search Result</p>
								<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Hotel Information: <span className="cancellation_text">{result.hotelName}, {result.roomName}</span></p>
								<div className="row sub-row">
									<div className="col-md-6">
										<p className="sub-title-col"> Booking Information </p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Provider: <span>{result.provider}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Booked On: <span>{ (result.bookedOn) ? moment(result.bookedOn).format("MMMM D, YYYY") : '' }</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i>  Arrival Date: <span>{startDate}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Departure Date: <span>{endDate}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Subtotal: <span>{numeral(result.subtotal).format()}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Taxes and Fees: <span>{numeral(result.taxesFees).format()}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Service Fee: <span>{numeral(result.serviceFee).format()}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Grand Total: <span>{numeral(result.totalNet).format()}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Agent: <span>{result.agent}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Agent Phone: <span>{result.agentPhone}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Agent Notes: <span>{result.agentNotes}</span></p>
										{
											(result.cancelledOn) ?(
												<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Cancelled On: <span>{moment(result.cancelledOn).format("MMMM D, YYYY")}</span></p>
											) : ''
										}
										{ (result.amountToBeRefunded) ? (<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Amount to be refunded: <span>{numeral(result.amountToBeRefunded).format()}</span></p>) : ''}
										{ (result.costToCancel) ? (<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Cost to cancel: <span>{numeral(result.costToCancel).format()}</span></p>) : ''}		
									</div>
									<div className="col-md-6">
										<p className="sub-title-col"> Guest Information </p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Customer Name: <span>{result.firstName} {result.lastName}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Address 1: <span>{result.address1}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Address 2: <span>{result.address2}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> City: <span>{result.city}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> State: <span>{result.state}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Zip: <span>{result.zip}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Country: <span>{result.country}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Phone Number: <span>{result.phoneNumber}</span></p>
										<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Email: <span>{result.email}</span></p>
									</div>
								</div>	
								<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Guest Special Requests:<span className="cancellation_text">{result.guestSpecialRequests}</span></p>
								{ (result.cancellationPolicy) ? (<p className="searchresult_title"><i className="fa fa-check" aria-hidden="true"></i> Cancellation Policy:<br /> <span className="cancellation_text">{result.cancellationPolicy}</span></p>) : ''}
								{
									(result.canCancel) ? (
										<div className="row stay-area">
											<div className="form-group">
												<div className="col-md-12 col-xs-12 col-sm-12 align-center">
													<button className="btn btn-red btn-lg" onClick={this.props.goCancelBooking}>Submit Cancellation</button>
												</div>
											</div>
										</div>
									) : ''
								}
								
							</div>
						</div>
					) : ''
				}
			</form>
		);
	}
}
CancelForm.contextTypes = {
	router: PropTypes.object.isRequired
};
export default CancelForm;