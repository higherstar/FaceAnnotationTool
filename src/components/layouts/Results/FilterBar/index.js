import React, { Component, PropTypes } from 'react';
import InputRange from 'react-input-range';
import ReactStars from 'react-stars'
import SelectBox from '../../../widgets/SelectBox';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import LocationAutoComplete from '../../../widgets/Input/LocationAutoComplete';
import Timer from '../../../widgets/Timer';
import Autocomplete from 'react-autocomplete';
import moment from 'moment';
import base64 from 'base-64';
import $ from 'jquery';
import CONSTANTS from '../../../../constants/Common';

require('bootstrap-daterangepicker/daterangepicker.css');
require('react-input-range/lib/css/index.css');
require('./_filterBar.css');

let acpTimeoutHandler = null;
let acStyles = CONSTANTS.AUTOCOMPLETE_STYLE;

class FilterBar extends Component {
	constructor(props) {
		super(props);
		this.today = moment();

		let checkIn = '';
		let checkOut = '';
		if(this.props.filterOptions.checkIn) {
			checkIn = moment(this.props.filterOptions.checkIn, "MMDDYYYY");//YYYY-MM-DDT00:00:00
		}
		if(this.props.filterOptions.checkOut) {
			checkOut = moment(this.props.filterOptions.checkOut, "MMDDYYYY");
		}

		this.state = {
			destination: this.props.destination,
			destLatitude: this.props.destLatitude,
			destLongitude: this.props.destLongitude,	
			hotel: this.props.hotel,
			hotelId: this.props.hotelId,
			hotelProvider: this.props.hotelProvider,
			rooms: this.props.rooms,
			latitude: this.props.latitude,
			longitude: this.props.longitude,

			price: this.props.filterOptions.price,
			rating: this.props.filterOptions.rating,
			amenities: this.props.filterOptions.amenities,
			checkIn: checkIn,
			checkOut: checkOut,
			checkDate: (checkIn && checkOut) ? checkIn.format("MMMM D, YYYY") + " - " + checkOut.format("MMMM D, YYYY") : '',

			valid: true,
			isRequiredDestination: false,
			isRequiredHotel: false,
			providers: this.props.filterOptions.providers		
		}
		this.logout = this.logout.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheckDate = this.handleCheckDate.bind(this);
		this.handleHotelChange = this.handleHotelChange.bind(this);
		this.handleSelectHotel = this.handleSelectHotel.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.handleSelectedDestinationPlace = this.handleSelectedDestinationPlace.bind(this);
		this.resetFilter = this.resetFilter.bind(this);
		this.setInitialPrice = this.setInitialPrice.bind(this);
	}

	gotoHome(){
		this.context.router.push('/');
	}

	setInitialPrice(price) {
		this.setState({
			price: price
		});
	}

	resetFilter() {
		let _this = this;
		this.setState({
			price: this.props.maxPrice,
			rating: 0,
			hotelClass: null,
			amenities: []
		});

		setTimeout(function() {
			_this.props.resetFilter();
		}, 500);
	}

    logout() {
        localStorage.removeItem('Token');
        localStorage.removeItem('Token_Type');
        sessionStorage.removeItem('params');
        sessionStorage.removeItem('confirm');
        this.context.router.push('/');
    }

	handleChange(v, type) {
		let state = this.state;
		if(v === "destination") {
			let value = type.target.value;
			if(value === "") {
				this.setState({
					destination: value,
					destLatitude: "",
					destLongitude: ""
				});
			}else {
				this.setState({
					destination: value,
					latitude: '',
					longitude: '',
					hotel: '',
					hotelId: '',
					hotelProvider: ''
				});
			}
		}else {
			state[type] = v;
			this.setState(state);
			if(type === "rating" || type === "amenities" || type === "providers") {
				this.props.handleFilter(v, type)
			}
		}
	}

	handleHotelChange(hotel) {
		let _this = this;
		this.setState(hotel);
		if(hotel.hotel === '') {
			this.setState({
				hotel: '',
				hotelId: '',
				hotelProvider: '',
				latitude: '',
				longitude: '',
				isRequiredHotel: true
			});
		}else {
			this.setState({
				destination: '',
				destLatitude: '',
				destLongitude: ''
			});			
			$("#input-destination").val('');

			clearTimeout(acpTimeoutHandler);
			acpTimeoutHandler = setTimeout(function() {
				_this.props.getAutocompleteProperties(hotel.hotel);
			}, 200);			
		}		
	}

	handleSearch() {
		let invalid = false;
		if(this.state.destLatitude === '' && this.state.latitude === '') {
			this.setState({
				valid: false,
				isRequiredDestination: true,
				isRequiredHotel: true
			})
			invalid = true;
		}

		if(invalid === true) {
			return;
		}

		let data = {
			Destination: this.state.destination,
			DestLatitude: this.state.destLatitude,
			DestLongitude: this.state.destLongitude,
			Hotel: this.state.hotel,
			HotelId: this.state.hotelId,
			HotelProvider: this.state.hotelProvider,
			Latitude: this.state.latitude,
			Longitude: this.state.longitude,
			CheckIn: ((this.state.checkIn) ? this.state.checkIn.format("MMDDYYYY") : ''),
			CheckOut: ((this.state.checkOut) ? this.state.checkOut.format("MMDDYYYY") : ''),
			Rooms: this.state.rooms
		};

		
		this.props.location.query.hotel=this.state.hotel;
		this.props.location.query.hotel_id=this.state.hotel_id;
		this.props.location.query.destination=this.state.destination;
		this.props.location.query.destlat=this.state.destLatitude;
		this.props.location.query.destlong=this.state.destLongitude;
		this.props.location.query.lat=this.state.latitude;
		this.props.location.query.long=this.state.longitude;
		this.props.location.query.hotel_provider=this.state.hotelProvider;

		sessionStorage.setItem('params', base64.encode(JSON.stringify(data)));			
		this.props.handleSearch();
	}

	handleCheckDate(event, picker) {
		let checkIn = picker.startDate;
		let checkOut = picker.endDate;

		if( checkIn.format("MMMM D, YYYY") !== checkOut.format("MMMM D, YYYY") ){
	        this.setState({
	        	checkIn: picker.startDate,
	        	checkOut: picker.endDate,
	        	checkDate: picker.startDate.format("MMMM D, YYYY") + ' - ' + picker.endDate.format("MMMM D, YYYY")
	        }, ()=> {
	        	// this.props.handleFilter(this.state.checkDate, 'checkDate');
	        });
	    }
    }

	matchStateToTerm(item, value) {
		if(value === '')
			return false;
		return (item.hotel.toLowerCase().indexOf(value.toLowerCase()) !== -1);		
	}

	handleSelectedDestinationPlace(place, destination) {
		this.setState({
			isRequiredDestination: false,
			destination: destination,
			destLatitude: place.geometry.location.lat(),
			destLongitude: place.geometry.location.lng()
		});
	}

	handleSelectHotel(value, item) {
		this.setState({
			hotel: item.hotel,
			hotelId: item.id,
			hotelProvider: item.provider,
			latitude: item.latitude,
			longitude: item.longitude,
			isRequiredHotel: false
		});
	}

	render() {	
		let label = '';
		// let checkDateRequired = (this.state.valid || (this.state.checkIn && this.state.checkOut)) ? '' : 'required';
		// <span className={`fa ${icon}`}></span>
		let isRequiredDestination = (this.state.valid || !this.state.isRequiredDestination) ? '' : 'required';
		let isRequiredHotel = (this.state.valid || !this.state.isRequiredHotel || isRequiredDestination === '') ? '' : 'required';
		let providersList = [];
		if(this.props.providersList && this.props.providersList.length > 0) {
			this.props.providersList.forEach((provider, idx) => {
				let loaded = (provider.loaded === true) ? "loaded" : "";
				let label_loaded=(provider.loaded === true) ? "label-success" : "label-danger";
				providersList.push(
					<div key={`provider-loaded-${idx}`} className={`col ${loaded}`}>
						<span className={`label ${label_loaded}`}>{provider.name}</span>	
					</div>
				);
			});
		}

		return (
			<div className="filter-bar" id="filter-bar">
				<div className="pull-left">
					<a className="cancel_link" onClick={this.gotoHome}><img src="/img/reservationscom.jpg" alt="Reservations.com"/></a>
				</div>
				<div className="pull-left">
					<div className="check-text-wrapper">
						<LocationAutoComplete
							id="input-destination"
							className={`form-control ui-autocomplete-input pull-left ${isRequiredDestination}`}
							placeholder="Destination"
							value={this.state.destination}
							onPlaceSelected={this.handleSelectedDestinationPlace}
							onChange={this.handleChange.bind(this, 'destination')}/>
						<div className="or-label">OR</div>
						<Autocomplete
							value={this.state.hotel}
							items={this.props.hotelsAutocompleteData}
							getItemValue={(item) => item.hotel}
							shouldItemRender={this.matchStateToTerm}
							onChange={(event, hotel) => this.handleHotelChange({ hotel })}
							onSelect={this.handleSelectHotel}
							wrapperProps={{className: "input-hotel"}}
							inputProps={{id: "input-hotel", className: "form-control pull-left " +  isRequiredHotel, placeholder:"Hotel"}}
							renderItem={(item, isHighlighted) => (
								<div
									style={isHighlighted ? acStyles.highlightedItem : acStyles.item}
									key={item.id}
								><p className="auto_name">{item.hotel}</p><p className="auto_address"> [ {item.address} ] </p></div>
							)}/>
						<button type="button" className="btn btn-red search-btn btn-lg btn-block" onClick={this.handleSearch.bind(this)}>Search</button>
						<div className="pull-left providers-list">
							{providersList}
							<div className="clearfix"></div>
						</div>
						<div className="clearfix"></div>
					</div>
					<div className="filter-opts">
						<div className="check-inoutdate pull-left">
							<label>Check in & out date</label>
							<DatetimeRangePicker
								opens="right"
								autoApply={true}
								locale={{format: "MMMM D, YYYY"}}
								minDate={this.today}
								startDate={this.state.checkIn}
								endDate={this.state.checkOut}
								onApply={this.handleCheckDate}
							>
								<input type="text" id="check-date" className="form-control" placeholder="Check in & out date" value={this.state.checkDate} readOnly/>
							</DatetimeRangePicker>
						</div>
						{
							(this.props.filterable === true) ?
							(
								<div className="pull-left">
									<div className="night-rate pull-left">
										<label>Max ${this.state.price}/night</label>
										<InputRange
											maxValue={this.props.maxPrice}
											minValue={0}
											formatLabel={value => `$${value}`}
											value={this.state.price}
											onChange={(v)=>this.handleChange(v, 'price')}
											onChangeComplete={(v)=>this.props.handleFilter(v, 'price')}/>						
									</div>
									<div className="user-rating pull-left">
										<label>Star Rating</label>
										<div style={{marginTop: "-5px"}}>
											<ReactStars
												count={5}
												onChange={(v)=>this.handleChange(v, 'rating')}
												size={35}
												value={this.state.rating}
												color1={'#cccccc'}
												color2={'#d23a2a'} />
										</div>
									</div>
									<div className="amenities pull-left">
										<label>Amenities</label>
										<div>
											<SelectBox
												label="Any amenity"
												value={this.state.amenities}
												onChange={(v)=>this.handleChange(v, 'amenities')}
												multiple={true}>
												<option value='hasInternet'>Free Wifi</option>
												<option value='hasBreakfast'>Free Breakfast</option>
											</SelectBox>
										</div>
									</div>
									<div className="amenities pull-left">
										<label>Providers</label>
										<div>
											<SelectBox
												label="Any provider"
												value={this.state.providers}
												onChange={(v)=>this.handleChange(v, 'providers')}
												multiple={true}>
												<option value='HotelBeds'>HotelBeds</option>
												<option value='PricelineCUG'>Priceline CUG</option>
												<option value='Priceline'>Priceline</option>
												<option value='Expedia'>Expedia</option>
											</SelectBox>
										</div>
									</div>
									<a className="btn btn-grey btn-small pull-left reset-filter-btn" onClick={this.resetFilter}>Reset</a>
									<div className="clearfix"></div>
								</div>
							) : ''
						}
						<div className="clearfix"></div>
						<Timer 
							flag='results'
							gotoHome={this.props.WillFresh}/>
					</div>
				</div>	
                <div className="pull-right">
						v1.0.11 - <span>{localStorage.getItem('username')}</span>
                    <a className="logout-link pull-right" href="" onClick={this.logout}>Logout</a>
                </div>				
				<div className="clearfix"></div>			
			</div>
		);
	}
}
FilterBar.contextTypes = {
	router: PropTypes.object.isRequired
};
export default FilterBar;
