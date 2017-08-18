import React, { Component, PropTypes } from 'react';
import ReactStars from 'react-stars'
import Collapsible from '../../widgets/Collapsible';
import numeral from 'numeral';
import CONSTANTS from '../../../constants/Common';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		numeral.defaultFormat('$0,0.00');
	}

	render() {
		let data = this.props.data;
		let rooms = [];		
		let monthNames = CONSTANTS.MONTH_NAMES;
		data.preBookRooms.forEach((row, rIdx) => {
			let pricing = [];
			row.roomRates.forEach((rate, pIdx) => {
				pricing.push(
					<div key={`pricing-${rIdx}-${pIdx}`}>
						<dt>{monthNames[new Date(rate.stayDate).getUTCMonth()]} {new Date(rate.stayDate).getUTCDate()}</dt>
						<dd>
							<span className="old">
								{(rate.promo === true) ? numeral(rate.basePrice).format() : ''}
							</span>
							<span className="rate">
								{numeral(rate.price).format()}
							</span>
						</dd>
					</div>
				);
			});			
			rooms.push(
				<div className="price-room" key={`proom-${rIdx}`}>
					<div className="price-room-title">{`Room ${rIdx + 1}`}</div>
					<div className="price-room-title">Room - {row.roomName} {row.roomDescription}</div>
					<div className="price-room-occupants">
						<small>{data.rooms[rIdx].adults} Adult, {data.rooms[rIdx].childrenCount} Children</small>
					</div>
					<div>
					<dl className="price-room-pricing">
						{pricing}						
					</dl>
					</div>
				</div>
			);
		});

		return (
			<div className="secondary-content col col-md-4 col-xs-12 col-sm-12 pull-right">
				<div className="row">
					<div className="col col-md-11 col-xs-12 col-sm-12">
						<div className="hotel-info property">
							<div className="row">
								<div className="property-image col-md-3 col-xl-12 col-xs-4">
									<img src={data.imageURL} alt=""/>
								</div>
								<div className="col-md-9">
									<h4 className="property-name">{data.hotelName}</h4>
									<address className="property-address">
										{data.address}
									</address>
									<div className="property-rating">
										<ReactStars
											count={5}
											size={22}
											value={data.starRating}
											edit={false}
											color1={'#cccccc'}
											color2={'#d23a2a'} />
									</div>
								</div>
							</div>
						</div>
						<div className="price-info price">
							{rooms}
							<div className="price-totals">
								<dl className="">
									<dt>Subtotal</dt>
									<dd>{numeral(data.summary.subTotal).format()}</dd>
									<dt>Taxes &amp; Fees</dt>
									<dd>{(numeral(data.summary.tax).format()==='$0.00' && numeral(data.summary.resortFee).format()==='$0.00') ? '' : numeral(data.summary.tax).format()}</dd>
									<dt>Service Fee</dt>
									<dd>{numeral(data.summary.resortFee).format()}</dd>
									<dt className="price-totals-total">Total</dt>
									<dd className="price-totals-total">{numeral(data.summary.currentTotal).format()}</dd>
								</dl>

								<div className="additional-fees">

									{(data.additionalFees) ? (<p><strong>Additional Fees</strong><br/>The following additional fees may apply to your reservation and, if so, will be charged to you by the property per room.</p>) : ''}
                                    { (data.summary.resortFee > 0) ?
										(<dl className="">
										</dl>)
                                     : '' }
								</div>
							</div>							
						</div>
						<div className="additional-info">
							<h5 className="additional-info-header">About your booking</h5>
							<div className="additional-info-body">
								<div className="accordion">
									<Collapsible trigger="Cancellation Policy" open={true}>
										<div dangerouslySetInnerHTML={{ __html: data.cancellationPolicy }}></div>
									</Collapsible>
									{ (data.promotionDetails) ? (
									<Collapsible trigger="View Promotion Details">
										<div dangerouslySetInnerHTML={{ __html: data.promotionDetails }}></div>
									</Collapsible>) : ''  }
                                    { (data.additionalPolicies) ? (
											<Collapsible trigger="Additional Policies">
												<div dangerouslySetInnerHTML={{ __html: data.additionalPolicies }}></div>
											</Collapsible>) : ''  }
								</div>
								<br/>
								<br/>
								<div>
									<span dangerouslySetInnerHTML={{ __html: data.checkInInstructions }}></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
// <h6><a href="/terms" target="_blank">Additional Terms and Conditions For This Booking</a></h6>
// <h6><a href="/policy" target="_blank">Privacy Policy</a></h6>

Sidebar.contextTypes = {
	router: PropTypes.object.isRequired
};
export default Sidebar;
