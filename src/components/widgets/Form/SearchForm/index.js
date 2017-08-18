import React, { Component } from 'react';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import LocationAutoComplete from '../../Input/LocationAutoComplete';
import Autocomplete from 'react-autocomplete';
import moment from 'moment';
import base64 from 'base-64';
import $ from 'jquery';
import './_searchForm.css';
import CONSTANTS from '../../../../constants/Common';
	
let adults = [];
let children = [];		
let roomOptions = [];
let ageOptions = [];
let acpTimeoutHandler = [];
let acStyles = CONSTANTS.AUTOCOMPLETE_STYLE;

class SearchForm extends Component {
	constructor(props) {
		super(props);
		this.today = moment();
		this.state = {
			submitted: false, /* when clicked submit button, this will be set to true */
			destination: '',
			destLatitude: '',
			destLongitude: '',
			latitude: '',
			longitude: '',
			hotel: '',
			hotelId: '',
			hotelProvider: '',
			checkIn: '',
			checkOut: '',
			checkDate: '',
			numberOfRooms: 1,
			numberOfAdults: [1],
			numberOfChildren: [],
			ages: [],
			valid: true,
			isRequiredDestination: false,
			isRequiredHotel: false
		};

		this.parseCookies = this.parseCookies.bind(this);
		this.handleCheckDate = this.handleCheckDate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAgeChange = this.handleAgeChange.bind(this);
		this.handleSelectHotel = this.handleSelectHotel.bind(this);
		this.matchStateToTerm = this.matchStateToTerm.bind(this);
		this.handleSelectedDestinationPlace = this.handleSelectedDestinationPlace.bind(this);
		this.handleHotelChange = this.handleHotelChange.bind(this);
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

	componentWillMount() {
		let ages = [];
		let i = 0;
		for(i=0; i<CONSTANTS.MAX_ROOMS; i++) {
			let row = [];
			for(let j=0; j<CONSTANTS.MAX_CHILDREN; j++) {
				row.push(0);				
			}
			ages.push(row);
		}	
		this.setState({
			ages: ages
		});

		roomOptions = [];
		adults = [];
		children = [];		
		ageOptions = [];
		
		for(i=1; i<=CONSTANTS.MAX_ROOMS; i++) {
			roomOptions.push(
				<option key={`room-opt-${i}`} value={i}>{i}</option>
			);
		}
		for(i=1; i<=CONSTANTS.MAX_ADULTS; i++) {
			adults.push(
				<option key={`adult-${i}`} value={i}>{i}</option>
			);
		}
		for(i=0; i<=CONSTANTS.MAX_CHILDREN; i++) {
			children.push(
				<option key={`child-${i}`} value={i}>{i}</option>
			);
		}
		for(i=0; i<=CONSTANTS.MAX_AGES; i++) {
			ageOptions.push(
				<option key={`age-${i}`} value={i}>{i}</option>
			);
		}	

		// this.parseCookies();			
	}

	parseCookies() {
		let params=sessionStorage.getItem('params');
		if(params) {
			let _checkIn = '';
			let _checkOut = '';
			let _checkDate = '';
			let _numberOfAdults = [];
			let _numberOfChildren = [];
			let _ages = [];

			params = JSON.parse(base64.decode(params));
			_checkIn = moment(params.CheckIn, "MMDDYYYY");//YYYY-MM-DDT00:00:00
			_checkOut = moment(params.CheckOut, "MMDDYYYY");
			_checkDate = `${_checkIn.format("MMMM D, YYYY")} - ${_checkOut.format("MMMM D, YYYY")}`;

			params.Rooms.forEach((room, idx) => {
				_numberOfAdults.push(room.Adults);
				_numberOfChildren.push(room.Children.length);
				_ages.push(room.Children);
			});

			this.setState({
				destination: (params) ? params.Destination : '',
				destLatitude: (params) ? params.DestLatitude : '',
				destLongitude: (params) ? params.DestLongitude : '',
				latitude: (params) ? params.Latitude : '',
				longitude: (params) ? params.Longitude : '',
				hotel: (params) ? params.Hotel : '',
				hotelId: (params) ? params.HotelId : '',
				hotelProvider: (params) ? params.HotelProvider : '',
				checkIn: _checkIn,
				checkOut: _checkOut,
				checkDate: _checkDate,
				numberOfRooms: (params) ? params.Rooms.length : 1,
				numberOfAdults: _numberOfAdults,
				numberOfChildren: _numberOfChildren,
				ages: _ages
			});	
		}	
	}

	handleCheckDate(event, picker) {
		let checkIn = picker.startDate;
		let checkOut = picker.endDate;
		
		if( checkIn.format("MMMM D, YYYY") !== checkOut.format("MMMM D, YYYY") ){
			this.setState({
				checkIn: checkIn,
				checkOut: checkOut,
				checkDate: checkIn.format("MMMM D, YYYY") + ' - ' + checkOut.format("MMMM D, YYYY")
			});
		}
	}	

	handleChange(type, e, value) {
		let state = this.state;
		value = (value) ? value : e.target.value;
		
		if(type === "numberOfRooms") {
			if(value < state.numberOfRooms) {
				for(let i = (state.numberOfRooms-1); i >= (value-1); i--) {
					state.numberOfAdults[i] = 1;
					state.numberOfChildren[i] = 0;
				}
			}else{
				for(let j=0; j<value; j++){
					state.numberOfAdults[j] = 1;
					state.numberOfChildren[j] = 0;
				}
			}
			//Initialize the values in default

		}else if(type === "destination") {
			if(value === "") {
				state.destLatitude = "";
				state.destLongitude = "";
			}else {
				state.latitude = "";
				state.longitude = "";
				state.hotel = "";
				state.hotelId = "";
				state.hotelProvider = "";
			}	
		}

		state[type] = value;
		this.setState(state);
	}   

	matchStateToTerm(item, value) {
		if(value === '')
			return false;
		return (item.hotel.toLowerCase().indexOf(value.toLowerCase()) !== -1);		
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

	handleSelectedDestinationPlace(place, destination) {
		this.setState({
			isRequiredDestination: false,
			destination: destination,
			destLatitude: place.geometry.location.lat(),
			destLongitude: place.geometry.location.lng()
		});
	}

	handleSelect(type, index, e) {
		let state = this.state;
		let value =  parseInt(e.target.value, 10);

		if(state[type].length < index) {
			let len = index - state[type].length + 1;
			for(let i=0; i<len; i++) {
				let v = (type === 'numberOfAdults') ? 1 : 0;
				state[type].push(v);
			}
		}

		state[type][index] = value;
		this.setState(state);		
	}

	handleAgeChange(room, child, e) {
		let ages = this.state.ages;
		for(let i=0; i<this.state.numberOfRooms; i++) {
			if(ages[i] === undefined) {
				ages[i] = [];
			}
		}
		ages[room][child] = parseInt(e.target.value, 10);
		this.setState({
			ages: ages
		});
	}	

	handleSubmit(e) {
		e.preventDefault();
		this.setState({
			submitted: true
		}, ()=> {

		});

		let invalid = false;

		let param_string='';

		if(this.state.checkIn === '' || this.state.checkOut === '') {
			this.setState({
				valid: false
			});
			invalid = true;
		}else{
			if(param_string!=='')
				param_string+='&';
			param_string+='checkin='+this.state.checkIn.format("MMDDYYYY")+'&checkout='+this.state.checkOut.format("MMDDYYYY");//YYYY-MM-DDT00:00:00
		}

		if(this.state.destLatitude === '' && this.state.latitude === '') {
			this.setState({
				valid: false,
				isRequiredDestination: true,
				isRequiredHotel: true
			});
			invalid = true;
		}else{
			if(param_string!=='')
				param_string+='&';
			param_string+='destlat='+this.state.destLatitude+'&lat='+this.state.latitude;
			param_string+='&destlong='+this.state.destLongitude+'&long='+this.state.longitude;
		}

		if(invalid === true) {
			return;
		}

		let params = this.state;
		let padding = CONSTANTS.MAX_ROOMS - params.numberOfRooms;
		if(padding > 0) {
			params.numberOfAdults.splice(params.numberOfRooms, padding);
			params.numberOfChildren.splice(params.numberOfRooms, padding);
		}

		for(let i=0; i<params.ages.length; i++) {
			params.ages[i].splice(params.numberOfChildren[i], CONSTANTS.MAX_CHILDREN-params.numberOfChildren[i]);
		}

		let rooms = [];
		for(let i=0; i<params.numberOfRooms; i++) {	
			param_string+='&room'+(i+1)+'='+params.numberOfAdults[i];
			let childrenCount = (params.numberOfChildren[i]) ? params.numberOfChildren[i] : 0;
			let children = [];
			if(childrenCount) {
				for(let j=0; j<childrenCount; j++) {
					if(params.ages[i][j] === undefined)  {
						params.ages[i][j] = 0;
					}
					param_string+=','+params.ages[i][j];
				}
				children = params.ages[i];
			}
			rooms.push({
				Adults: (params.numberOfAdults[i]) ? params.numberOfAdults[i] : 1,
				ChildrenCount: childrenCount,
				Children: children
			});
		}
		if(this.state.hotelId !== ''){
			param_string+='&hotel='+this.state.hotel+'&hotel_id='+this.state.hotelId+'&hotel_provider='+this.state.hotelProvider+'&search_type=1';
		}else{
			param_string+='&hotel='+this.state.hotel+'&hotel_id='+this.state.hotelId+'&hotel_provider='+this.state.hotelProvider+'&search_type=0';
		}
		param_string+='&destination='+this.state.destination;
		param_string+='&room_counts='+params.numberOfRooms;
		

		let data = {
			Destination: this.state.destination,
			DestLatitude: this.state.destLatitude,
			DestLongitude: this.state.destLongitude,
			Hotel: this.state.hotel,
			HotelId: this.state.hotelId,
			HotelProvider: this.state.hotelProvider,
			SearchType : (this.state.hotelId !== '') ? 1 : 0, // 0 if Destination, 1 if Hotel.
			Latitude: this.state.latitude,
			Longitude: this.state.longitude,
			// DestinationType: null,
			CheckIn: this.state.checkIn.format("MMDDYYYY"),
			CheckOut: this.state.checkOut.format("MMDDYYYY"),
			Rooms: rooms
		};
		sessionStorage.setItem('params', base64.encode(JSON.stringify(data)));
		this.props.goResultsPage(param_string);
	}

	render() {
		let rooms = [];
		let i = 0;

		let checkDateRequired = (this.state.valid || (this.state.checkIn && this.state.checkOut)) ? '' : 'required';
		let isRequiredDestination = (this.state.valid || !this.state.isRequiredDestination) ? '' : 'required';
		let isRequiredHotel = (this.state.valid || !this.state.isRequiredHotel || isRequiredDestination === '') ? '' : 'required';

		let destinationFeedback = '';
		let destinationGlyphIcon = '';
		if(this.state.submitted === true) {
			if(this.state.destination!=='' || this.state.hotel!=='') {
				destinationGlyphIcon =  '';
				destinationFeedback = '';
				isRequiredDestination='';
			}else {
				destinationGlyphIcon =  'remove';
				destinationFeedback = 'has-error';
			}
		}

		let hotelFeedback = '';
		let hotelGlyphIcon = '';
		if(this.state.submitted === true) {
			if(this.state.destination!=='' || this.state.hotel!=='') {
				hotelGlyphIcon =  '';
				hotelFeedback = '';
				isRequiredHotel='';
			}else {
				hotelGlyphIcon =  'remove';
				hotelFeedback = 'has-error';
			}
		}

		let dateFeedback = '';
		let dateGlyphIcon = '';
		if(this.state.submitted === true) {
			if(this.state.checkDate!=='') {
				dateGlyphIcon =  '';
				dateFeedback = '';
				checkDateRequired='';
			}else {
				dateGlyphIcon =  'remove';
				dateFeedback = 'has-error';
			}
		}

		for(i=0; i<this.state.numberOfRooms; i++) {
			let ages = [];
			let idx = i;
			let c = 0;
			if(this.state.numberOfChildren[i] > 0) {
				for(c=0; c<this.state.numberOfChildren[i]; c++) {
					let child = c;
					ages.push(
						<div key={`age-${i}-${c}`} className="form-group col-md-2">
							<label className="control-label">Child 1 Age</label>
							<select className="form-control valid" value={(this.state.ages[idx]) ? this.state.ages[idx][child] : 0} onChange={this.handleAgeChange.bind(this, idx, child)}>
								{ageOptions}
							</select>
						</div>						
					);
				}
			}

			rooms.push(
				<div key={`search-room-${i}`} className="room-row row">
					<div className="col-lg-12">
						<div className="form-group room-row-count">
							<strong>Room {i+1}</strong>
						</div>
					</div>
					<div className="col-md-3">
						<div className="form-group col-md-6">
							<label className="control-label">Adults</label>
							<select className="form-control" value={this.state.numberOfAdults[i]} onChange={this.handleSelect.bind(this, 'numberOfAdults', idx)}>
								{adults}
							</select>
						</div>
						<div className="form-group col-md-6">
							<label className="control-label">Children</label> <br/>
							<select className="form-control" value={this.state.numberOfChildren[i]} onChange={this.handleSelect.bind(this, 'numberOfChildren', idx)}>
								{children}
							</select>
						</div>
					</div>
					<div className="children col-md-9">
						{ages}
					</div>
				</div>				
			);
		}

		return (
			<form action="/results" id="search-form" className="form-horizontal search" onSubmit={this.handleSubmit.bind(this)}>
				<div className="panel panel-primary">
					<div className="panel-heading">
						<h4>New Reservation</h4>
					</div>
					<div className="panel-body">
						<div className="row dest-search">
							<div className="dest col-md-6">
								<div className={`form-group ${destinationFeedback}`}>
									<label>Destination (City, Landmark, Airport or Address)</label>
									<LocationAutoComplete
										id="input-destination"
										className={`form-control ${isRequiredDestination}`}
										placeholder="Destination"
										value={this.state.destination}
										onPlaceSelected={this.handleSelectedDestinationPlace}
										onChange={this.handleChange.bind(this, 'destination')}/>
									<span className={`glyphicon form-control-feedback glyphicon-${destinationGlyphIcon}`} aria-hidden="true"></span>									
								</div>
							</div>
							<div className="col-md-1 text-center">
								<div className="form-group">
									<label>&nbsp;</label>
									<div className="or">OR</div>
								</div>								
							</div>
							<div className="dest col-md-5">
								<div className={`form-group ${hotelFeedback}`}>
									<label>Hotel Name</label>
									<Autocomplete
										value={this.state.hotel}
										items={this.props.hotelsAutocompleteData}
										getItemValue={(item) => item.hotel}
										shouldItemRender={this.matchStateToTerm}
										onChange={(event, hotel) => this.handleHotelChange({ hotel })}
										onSelect={this.handleSelectHotel}
										wrapperProps={{className: "input-hotel"}}
										inputProps={{id: "input-hotel", className: "form-control " + isRequiredHotel, placeholder:"Hotel Name"}}
										renderItem={(item, isHighlighted) => (
											<div
												style={isHighlighted ? acStyles.highlightedItem : acStyles.item}
												key={item.id}
											><p className="auto_name">{item.hotel}</p><p className="auto_address"> [ {item.address} ] </p></div>
										)}/>
									<span className={`glyphicon form-control-feedback glyphicon-${hotelGlyphIcon}`} aria-hidden="true"></span>								
								</div>
							</div>
						</div>
						<div className="row">
							<div className={`dest col-md-3 ${dateFeedback}`}>
								<label>Check In & Check Out Date</label>
								<DatetimeRangePicker
									opens="right"
									autoApply={true}
									locale={{format: "MMMM D, YYYY"}}
									minDate={this.today}
									startDate={this.state.checkIn}
									endDate={this.state.checkOut}
									onApply={this.handleCheckDate}
								>
								<input type="text" ref="checkDate" id="check-date" className={`form-control ${checkDateRequired}`} placeholder="Check In & Check Out Date" value={this.state.checkDate} readOnly/>
								<span className={`glyphicon form-control-feedback glyphicon-${dateGlyphIcon}`} aria-hidden="true"></span>	
								</DatetimeRangePicker>
							</div>
							<div className="col-md-2">
								<div className="form-group">
									<label>Rooms</label>
									<select className="form-control valid" value={this.state.numberOfRooms} onChange={this.handleChange.bind(this, 'numberOfRooms')}>
										{roomOptions}
									</select>
								</div>
							</div>
						</div>
						<div id="rooms">
							{rooms}
						</div>
						<div className="row">
							<div className="form-group">
								<div className="col-md-offset-5 col-md-2 no-padding">
									<button type="submit" className="btn btn-red btn-lg">Search Hotels</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
	}
}

export default SearchForm;
