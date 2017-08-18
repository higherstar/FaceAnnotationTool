import React, { Component } from 'react';

class Amenities extends Component {
	render() {
		let item = this.props.item;
		let amentitesList = [];
		if(item.hasInternet === true) {
			amentitesList.push('Free Wifi');
		}
		if(item.hasParking === true) {
			amentitesList.push('Free Parking');
		}
		if(item.hasBreakfast === true) {
			amentitesList.push('Free Breakfast');
		}

		let cols = [];
		if(amentitesList.length) {
			amentitesList.forEach((item, index) => {
				let icon = '';
				if(item === "Free Breakfast") {
					icon = "free-breakfast";
				}else if(item === "Free Parking") {
					icon = "free-parking";
				}else if(item === "Free Wifi") {
					icon = "free-wifi";
				}

				cols.push(
					<span key={`amenity-${index}`} className="ig">
						<span className="qg">
							<span className="rg amenity-icon">
								<span className={`has ${icon}`}></span>
							</span>
							<span className="zg">{item}</span>
						</span>
					</span>
				);			
			});
		}

		return (<div>{cols}</div>);
	}
}

export default Amenities;
