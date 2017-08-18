import React, { Component } from 'react';
import ReactStars from 'react-stars'
import {Label} from 'react-bootstrap';

class HotelItem extends Component {
	render() {
		let item = this.props.item;
		let providerCols = [];

		// let hasPromo = false;
		item.providerResults.forEach((pItem, pIndex) => {
			// if(pItem.hasPromo === true) {
			// 	hasPromo = true;
			// }
			providerCols.push(
				<div key={`p-${this.props.index}-${pIndex}`} className="provider-col">
					<Label bsStyle={(pItem.providerId === item.preferredProviderId) ? "success" : "danger"}>{pItem.name}</Label>
				</div>
			);
		});

		return (
			<div className="hotel-item" onClick={()=>this.props.handleSelectHotel(item)}>
				<div className="wrapper">
					<div className="thumb"><img src={item.imageUrl} role="presentation"/></div>
					<div className="price-wrapper"><span className={item.fromPrice ? '' : 'no_available'}>{item.fromPrice ? '$'+parseInt(item.fromPrice, 10) : 'Sold Out'}</span></div>
					<div className="title">{item.hotelName}</div>
					<span className="details">
						<div>
							<span className="rate">{item.starRating}</span>
							<div className="rating">
								<ReactStars
									count={5}
									size={18}
									value={item.starRating}
									edit={false}
									color1={'#cccccc'}
									color2={'#d23a2a'} />
							</div>						
							<span className="hotel-stars">
								{(item.hasPromo && item.hasPromo === true) ? (<span className="fa fa-dollar"></span>) : ''}
								{/*({item.NumberOfReviews}) · {item.Class}-star hotel*/}
							</span>
						</div>
						<div>
							<div className="wrapped" style={{marginTop: '3px'}}>
								<span>{item.distance.toPrecision(2)} mi</span>	
							</div>
						</div>
						<span className="space1"></span>
					</span>
					<div className="providers">
						{providerCols}
						<div className="clearfix"></div>
					</div>
				</div>					
			</div>
		);		
	}
}

export default HotelItem;
