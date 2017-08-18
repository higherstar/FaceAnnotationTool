import React, { Component } from 'react';
import moment from 'moment';
import cardValidator from 'card-validator';
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
import './_checkoutForm.css';
import $ from 'jquery';
import numeral from 'numeral';

// constants
import CountriesConstant from '../../../../constants/Countries';
import StatesConstant from '../../../../constants/States';
import PhoneNumbersConstant from '../../../../constants/PhoneNumbers';
import CallCenterNumbersConstant from '../../../../constants/CallCenterNumbers';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class CheckoutForm extends Component {
	constructor(props) {
		numeral.defaultFormat('$0,0.00');
		super(props);
		this.cardMonthes = [];
		this.cardYears = [];
		this.currentYar = moment().format('YYYY');
		this.currentMonth = moment().format('M');
		this.phoneNumbers = [];
		this.countries = [];
		this.callcenternumbers=[];
		this.state = {
			submitted: false, /* when clicked submit button, this will be set to true */
			guests: this.props.data.rooms,

			firstName: '',
			lastName: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			zipCode: '',
			phone: '1-us',
			tel: '',
			email: '',			
			inputFirstName: false,
			inputLastName: false,
			inputAddress1: false,
			inputCity: false,
			inputZipCode: false,
			inputState: false,
			inputTel: false,
			inputEmail: false,

			cardNumber: '',
			cardSecurityCode: '',
			inputCardNumber: false,	
			inputCardSecurityCode: false,
			invalidCardNumber: true,
			cardType: '',
			cardMonth: '',
			cardYear: '',

			agentPhone: '',
			agentNotes: '',
			guestSpecialRequests: '',

			country: 'US',
			checkoutable: this.props.checkoutable
		};

		this.handleChange = this.handleChange.bind(this);	
		this.handleGuestChange = this.handleGuestChange.bind(this);
		this.handleChildChange = this.handleChildChange.bind(this);
		this.enableCheckout = this.enableCheckout.bind(this);
		this.getValidNumber = this.getValidNumber.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({
			submitted: true
		}, ()=> {
			if($(".form-group.has-error").length === 0) {
				let rooms = [];
				this.state.guests.forEach((room, rIndex) => {
					let adults = [];
					room.adultsData.forEach((adult, aIndex) => {
						let data = {
							firstName: adult.firstName,
							lastName: adult.lastName,
							age: adult.age
						};
						// if(rIndex === 0 && aIndex === 0) {
							// let prefix = (adult.phone).split('-');
							// data['homePhone'] = '+' + prefix[0] + '-' + adult.tel;
							// data['email'] = adult.email;
						// }
						adults.push(data);
					});
					rooms.push({
						name: (rIndex === 0) ? (this.props.data.roomName) : '',
						adults: adults
					});
				});

				let prefix = this.state.phone.split('-');
				let checkoutRequest = {
					rooms: rooms,
					creditCardNumber: this.state.cardNumber.trim(),
					creditCardIdentifer: this.state.cardSecurityCode,
					creditCardType: this.state.cardType,
					creditCardExpirationMonth: this.state.cardMonth,
					creditCardExpirationYear: this.state.cardYear,
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					address1: this.state.address1,
					address2: this.state.address2,
					country: this.state.country,
					city: this.state.city,
					state: this.state.state,
					zipCode: this.state.zipCode,
					phoneNumber: `+${prefix[0]}-${this.state.tel}`,
					email: this.state.email,
					guestSpecialRequests: this.state.guestSpecialRequests,
					agentNotes: this.state.agentNotes,
					agentPhone: this.state.agentPhone
				};
				
				let data={
					checkoutRequest: checkoutRequest,
					preBookId: this.props.preBookData.id,
					preBookRoom: this.props.preBookData.preBookRoom,
					property: this.props.preBookData.property,
					searchRequest: this.props.preBookData.searchRequest,
					user_email: localStorage.getItem('username')
				};
				
				this.setState({
					checkoutable: false
				}, ()=> {
					// Call API with this data
					this.props.handleCheckout(data);
				});
			}
		});
	}

	enableCheckout() {
		this.setState({
			checkoutable: true
		});
	}

	handleChange(type, e) {
		let state = this.state;
		let value = e.target.value;
		state[type] = value;
		state['input' + type.charAt(0).toUpperCase() + type.slice(1)] = true;
		this.setState(state);

		if(type === 'cardNumber') {
			// Test Purpose
			if(value === "5401999999999999") {
				this.setState({
					invalidCardNumber: false,
					cardType: "master-card"
				});
			}else {
				let numberValidation = cardValidator.number(value.trim());
				if((numberValidation.isValid === true) && (numberValidation.card !== null) && (	
					numberValidation.card.type === "visa" ||
					numberValidation.card.type === "master-card" ||
					numberValidation.card.type === "discover" ||
					numberValidation.card.type === "american-express" )) {
					// Valid card number				
					this.setState({
						invalidCardNumber: false,
						cardType: numberValidation.card.type
					});
				}else {
					this.setState({
						invalidCardNumber: true,
						cardType: ''
					});
				}
			}
		}
	}   

	handleGuestChange(type, roomIndex, adultIndex, e) {
		let guests = this.state.guests;
		guests[roomIndex].adultsData[adultIndex]['input' + type.charAt(0).toUpperCase() + type.slice(1)] = true;
		guests[roomIndex].adultsData[adultIndex][type] = e.target.value;
		this.setState({
			guests: guests
		});		
	}

	handleChildChange(type, roomIndex, childIndex, e) {
		let guests = this.state.guests;
		guests[roomIndex].childrenData[childIndex][type] = e.target.value;
		this.setState({
			guests: guests
		});		
	}

	componentWillMount() {
		for(let i=1; i<=12; i++) {
			this.cardMonthes.push(<option key={`month-${i}`} value={i}>{`${i} - ${MONTH_NAMES[i-1]}`}</option>);
		}

		for(let i=this.currentYar; i<=parseInt(this.currentYar, 10)+10; i++) {
			this.cardYears.push(<option key={`year-${i}`} value={i}>{i}</option>);
		}

		CountriesConstant.forEach((country, index) => {
			this.countries.push(
				<option key={`country-${index}`} value={country.value}>{country.label}</option>
			);
		});

		PhoneNumbersConstant.forEach((pn, index) => {
			this.phoneNumbers.push(
				<option key={`pn-${index}`} value={pn.value}>{pn.label}</option>
			);
		});

		this.callcenternumbers.push(
			<option key="pn_none" value="">-Select Number-</option>
		);
		CallCenterNumbersConstant.forEach((pn, index) => {
			this.callcenternumbers.push(
				<option key={`pn-${index}`} value={pn.number}>{pn.number}</option>
			);
		});
		this.callcenternumbers.push(
			<option key="pn_chat" value="CHAT">CHAT</option>
		);
        this.callcenternumbers.push(
			<option key="pn_sms" value="SMS">SMS</option>
        );

		let guests = this.state.guests;
		this.state.guests.forEach((guest, i) => {
			let adults = [];
			for(let i=0;i<guest.adults; i++) {
				adults.push({
					firstName: '',
					lastName: '',
					age: ''
				});
			}
			guest.adultsData = adults;

			let children = [];
			for(let i=0;i<guest.childrenCount; i++) {
				children.push({
					firstName: '',
					lastName: '',
					age: guest.children[i]
				});
			}
			guest.childrenData = children;
		});
		this.setState({
			guests: guests
		});
	}

  	getValidNumber(phoneNumber) {
	    const phoneUtil = PhoneNumberUtil.getInstance();
	    const parsedNumber = phoneUtil.parse(phoneNumber);
	    return phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
  	}

	render() {		
		let cardNumberGlyphIcon = '';
		let cardNumberFeedback = '';
		let cardNumberLabel = 'Debit/Credit Card';
		
		if(this.state.inputCardNumber === true || this.state.submitted === true) {
			if(this.state.invalidCardNumber === true) {
				cardNumberLabel = (this.state.cardNumber === '') ? 'Debit/Credit card number cannot be blank' : 'Please enter a valid credit card number';
				cardNumberGlyphIcon = 'remove';
				cardNumberFeedback = 'has-error';
			}else {
				cardNumberGlyphIcon = 'ok';
				cardNumberFeedback = 'has-success';
			}		
		}

		let cardCoderGlyphIcon = '';
		let cardCodeFeedback = '';
		let cardCodeLabel = 'Card Security Code';

		if(this.state.inputCardSecurityCode === true || this.state.submitted === true) {
			if(this.state.cardSecurityCode.length >= 3) {
				cardCoderGlyphIcon = 'ok';
				cardCodeFeedback = 'has-success';	
				if(this.state.invalidCardNumber !== true) {
					// Valid card number
					if(this.state.cardType === 'american-express') {
						// In case of American express card, code length should be 4.
						if(this.state.cardSecurityCode.length !== 4) {
							cardCodeLabel = 'Card security code must be 4 digits';
							cardCoderGlyphIcon = 'remove';
							cardCodeFeedback = 'has-error';							
						}
					}else {
						// Otherwise, code length should be 3.
						if(this.state.cardSecurityCode.length !== 3) {
							cardCodeLabel = 'Card security code must be 3 digits';
							cardCoderGlyphIcon = 'remove';
							cardCodeFeedback = 'has-error';	
						}
					}
				}
			}else {
				cardCodeLabel = (this.state.cardSecurityCode === '') ? 'Card security code cannot be blank' : 'Card security code must be 3 or 4 digits';
				cardCoderGlyphIcon = 'remove';
				cardCodeFeedback = 'has-error';
			}		
		}

		let cardMonthGlyphIcon = '';
		let cardMonthFeedback = '';
		let cardYearGlyphIcon = '';
		let cardYearFeedback = '';
		let expDateLabel = 'Expiration Date';

		if(this.state.submitted === true) {
			if(this.state.cardMonth === '') {
				cardMonthGlyphIcon =  'remove';
				cardMonthFeedback = 'has-error';
				expDateLabel = (<span className="error">Expiration date cannot be blank</span>);
			}else {
				cardMonthGlyphIcon =  'ok';
				cardMonthFeedback = 'has-success';
			}

			if(this.state.cardYear === '') {
				cardYearGlyphIcon =  'remove';
				cardYearFeedback = 'has-error';
				expDateLabel = (<span className="error">Expiration date cannot be blank</span>);
			}else {
				cardYearGlyphIcon =  'ok';
				cardYearFeedback = 'has-success';
			}
		}

		if(this.state.cardYear === this.currentYar && parseInt(this.state.cardMonth, 10) < parseInt(this.currentMonth, 10)) {
			expDateLabel = 'Enter a valid expiration date';
			cardMonthGlyphIcon =  'remove';
			cardMonthFeedback = 'has-error';
			cardYearGlyphIcon =  'remove';
			cardYearFeedback = 'has-error';			
		}		

		let firstNameFeedback = '';
		let firstNameGlyphIcon = '';
		if(this.state.inputFirstName === true || this.state.submitted === true) {
			if(this.state.firstName === '') {
				firstNameGlyphIcon =  'remove';
				firstNameFeedback = 'has-error';
			}else {
				firstNameGlyphIcon =  'ok';
				firstNameFeedback = 'has-success';
			}
		}

		let lastNameFeedback = '';
		let lastNameGlyphIcon = '';
		if(this.state.inputLastName === true || this.state.submitted === true) {
			if(this.state.lastName === '') {
				lastNameGlyphIcon =  'remove';
				lastNameFeedback = 'has-error';
			}else {
				lastNameGlyphIcon =  'ok';
				lastNameFeedback = 'has-success';
			}
		}

		let countryFeedback = '';
		let countryGlyphIcon = '';
		if(this.state.submitted === true) {
			countryGlyphIcon =  'ok';
			countryFeedback = 'has-success';
		}		

		let addressFeedback = '';
		let addressGlyphIcon = '';
		if(this.state.inputAddress1 === true || this.state.submitted === true) {
			if(this.state.address1 === '') {
				addressGlyphIcon =  'remove';
				addressFeedback = 'has-error';
			}else {
				addressGlyphIcon =  'ok';
				addressFeedback = 'has-success';
			}
		}

		let cityFeedback = '';
		let cityGlyphIcon = '';
		if(this.state.inputCity === true || this.state.submitted === true) {
			if(this.state.city === '') {
				cityGlyphIcon =  'remove';
				cityFeedback = 'has-error';
			}else {
				cityGlyphIcon =  'ok';
				cityFeedback = 'has-success';
			}
		}

		let zipCodeFeedback = '';
		let zipCodeGlyphIcon = '';
		if(this.state.inputZipCode === true || this.state.submitted === true) {
			if(this.state.zipCode === '') {
				zipCodeGlyphIcon =  'remove';
				zipCodeFeedback = 'has-error';
			}else {
				zipCodeGlyphIcon =  'ok';
				zipCodeFeedback = 'has-success';
			}
		}				

		let stateFeedback = '';
		let stateGlyphIcon = '';
		if(StatesConstant[this.state.country] && this.state.submitted === true) {
			if(this.state.state === '') {
				stateGlyphIcon =  'remove';
				stateFeedback = 'has-error';
			}else {
				stateGlyphIcon =  'ok';
				stateFeedback = 'has-success';
			}
		}	

		let phoneFeedback = '';
		let phoneGlyphIcon = '';
		let phoneLabel = (<span>Phone Number <small>in case we need to reach you</small></span>);
		if(this.state.submitted === true || this.state.inputTel === true) {
			if(this.state.tel === '') {
				phoneFeedback = 'has-error';
				phoneGlyphIcon = 'remove';
				phoneLabel = 'Phone number cannot be blank';
			}else {

				// phoneFeedback = 'has-success';
				// phoneGlyphIcon = 'ok';	

				let valid = false;
				let phoneNumber='+'+ this.state.phone.split("-")[0] + ' '+ this.state.tel;
			    try {
			      const phoneUtil = PhoneNumberUtil.getInstance();
			      valid =  phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber));
			    } catch(e) {
			      valid = false;
			    }
			    if(valid) {
			      	phoneFeedback = 'has-success';
					phoneGlyphIcon = 'ok';	
			    } else {
			      	phoneFeedback = 'has-error';
					phoneGlyphIcon = 'remove';
					phoneLabel = 'Phone number '+phoneNumber+' is not valid';
			    }				
			}
		}			

		let emailFeedback = '';
		let emailGlyphIcon = '';
		let emailLabel = (<span>Email Address <small>we'll send the confirmation here</small></span>);
		if(this.state.submitted === true || this.state.inputEmail === true) {
			if(this.state.email === '') {
				emailFeedback = 'has-error';
				emailGlyphIcon = 'remove';
				emailLabel = 'Email address cannot be blank';
			}else if(!(this.state.email).match(/.+@.+/)) {
				emailFeedback = 'has-error';
				emailGlyphIcon = 'remove';
				emailLabel = 'Please enter a valid email address';
			}else {
				emailFeedback = 'has-success';
				emailGlyphIcon = 'ok';					
			}
		}					


		let callcenterFeedback = '';
		let callcenterGlyphIcon = '';
		if(this.state.submitted === true) {
			if(this.state.agentPhone === '') {
				callcenterGlyphIcon =  'remove';
				callcenterFeedback = 'has-error';
			}else {
				callcenterGlyphIcon =  'ok';
				callcenterFeedback = 'has-success';
			}
		}

		let states = [];
		if(StatesConstant[this.state.country]) {
			StatesConstant[this.state.country].forEach((state, index) => {
				states.push(
					<option key={`state-${index}`} value={state.value}>{state.label}</option>
				);
			});			
		}

		let guestRooms = [];
		this.state.guests.forEach((room, i) => {
			let guestAdults = [];
			for(let j=0; j<room.adults; j++) {
				let guest = room.adultsData[j];
				let guestFirstNameFeedback = '';
				let guestFirstNameGlyphIcon = '';
				let guestFirstNameLabel = 'First Name';
				if(this.state.submitted === true || guest.inputFirstName === true) {
					if(guest.firstName === '') {
						guestFirstNameFeedback = 'has-error';
						guestFirstNameGlyphIcon = 'remove';		
						guestFirstNameLabel = 'First name cannot be blank';			
					}else {
						guestFirstNameFeedback = 'has-success';
						guestFirstNameGlyphIcon = 'ok';					
					}
				}

				let guestLastNameFeedback = '';
				let guestLastNameGlyphIcon = '';
				let guestLastNameLabel = 'Last Name';
				if(this.state.submitted === true || guest.inputLastName === true) {
					if(guest.lastName === '') {
						guestLastNameFeedback = 'has-error';
						guestLastNameGlyphIcon = 'remove';
						guestLastNameLabel = 'Last name cannot be blank';	
					}else {
						guestLastNameFeedback = 'has-success';
						guestLastNameGlyphIcon = 'ok';					
					}

				}

				let guestAgeFeedback = '';
				let guestAgeGlyphIcon = '';
				if(this.state.submitted === true || guest.inputAge === true) {
					if(guest.age === '') {
						guestAgeFeedback = 'has-error';
						guestAgeGlyphIcon = 'remove';
					}else if(!/^\d+$/.test(guest.age)) {
						guestAgeFeedback = 'has-error';
						guestAgeGlyphIcon = 'remove';
					}else {
						guestAgeFeedback = 'has-success';
						guestAgeGlyphIcon = 'ok';					
					}
				}				
				guestAdults.push(
					<div key={`adult-${i}-${j}`} className="form-body guest-adult">
						<h5>Guest {j+1}</h5>
						<div className="row">
							<div className="col-xs-5">
								<div className={`form-group has-feedback ${guestFirstNameFeedback}`}>
									<label className="control-label" htmlFor={`room${i}_{j}_first_name`}>{guestFirstNameLabel}</label>
									<input className="form-control" id={`room${i}_{j}_first_name`} maxLength="18" size="18" type="text" value={guest.firstName} onChange={this.handleGuestChange.bind(this, 'firstName', i, j)} placeholder="First Name"/>
									<span className={`glyphicon form-control-feedback glyphicon-${guestFirstNameGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
							<div className="col-xs-5">
								<div className={`form-group has-feedback ${guestLastNameFeedback}`}>
									<label className="control-label" htmlFor={`room${i}_{j}_last_name`}>{guestLastNameLabel}</label>
									<input className="form-control" id={`room${i}_{j}_last_name`} maxLength="18" size="18" type="text" value={guest.lastName} onChange={this.handleGuestChange.bind(this, 'lastName', i, j)} placeholder="Last Name"/>
									<span className={`glyphicon form-control-feedback glyphicon-${guestLastNameGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
							<div className="col-xs-2">
								<div className={`form-group has-feedback ${guestAgeFeedback}`}>
									<label className="control-label" htmlFor={`room${i}_{j}_age`}>Age</label>
									<input className="form-control" id={`room${i}_{j}_age`} maxLength="2" size="2" type="text" value={guest.age} onChange={this.handleGuestChange.bind(this, 'age', i, j)} placeholder="Age"/>
									<span className={`glyphicon form-control-feedback glyphicon-${guestAgeGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
						</div>
					</div>	
				);
			}

			let guestChildren = [];
			for(let k=0; k<room.childrenCount; k++){
				let child = room.childrenData[k];
				let childFirstNameFeedback = '';
				let childFirstNameGlyphIcon = '';
				let childFirstNameLabel = 'First Name';
				if(this.state.submitted === true || child.inputFirstName === true) {
					if(child.firstName === '') {
						childFirstNameFeedback = 'has-error';
						childFirstNameGlyphIcon = 'remove';		
						childFirstNameLabel = 'First name cannot be blank';			
					}else {
						childFirstNameFeedback = 'has-success';
						childFirstNameGlyphIcon = 'ok';					
					}
				}

				let childLastNameFeedback = '';
				let childLastNameGlyphIcon = '';
				let childLastNameLabel = 'Last Name';
				if(this.state.submitted === true || child.inputLastName === true) {
					if(child.lastName === '') {
						childLastNameFeedback = 'has-error';
						childLastNameGlyphIcon = 'remove';
						childLastNameLabel = 'Last name cannot be blank';	
					}else {
						childLastNameFeedback = 'has-success';
						childLastNameGlyphIcon = 'ok';					
					}

				}

				let childAgeFeedback = '';
				let childAgeGlyphIcon = '';
				if(this.state.submitted === true || child.inputAge === true) {
					if(child.age === '') {
						childAgeFeedback = 'has-error';
						childAgeGlyphIcon = 'remove';
					}else if(!/^\d+$/.test(child.age)) {
						childAgeFeedback = 'has-error';
						childAgeGlyphIcon = 'remove';
					}else {
						childAgeFeedback = 'has-success';
						childAgeGlyphIcon = 'ok';					
					}
				}
				guestChildren.push(
					<div key={`adult-${i}-${k}`} className="form-body guest-adult">
						<h5>Child {k+1}</h5>
						<div className="row">
							<div className="col-xs-5">
								<div className={`form-group has-feedback ${childFirstNameFeedback}`}>
									<label className="control-label" htmlFor={`room${i}_{j}_first_name`}>{childFirstNameLabel}</label>
									<input className="form-control" id={`room${i}_{k}_first_name`} maxLength="18" size="18" type="text" value={child.firstName} onChange={this.handleChildChange.bind(this, 'firstName', i, k)} placeholder="First Name" />
									<span className={`glyphicon form-control-feedback glyphicon-${childFirstNameGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
							<div className="col-xs-5">
								<div className={`form-group has-feedback ${childLastNameFeedback}`}>
									<label className="control-label" htmlFor={`room${i}_{j}_last_name`}>{childLastNameLabel}</label>
									<input className="form-control" id={`room${i}_{k}_last_name`} maxLength="18" size="18" type="text" value={child.lastName} onChange={this.handleChildChange.bind(this, 'lastName', i, k)} placeholder="Last Name"/>
									<span className={`glyphicon form-control-feedback glyphicon-${childLastNameGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
							<div className="col-xs-2">
								<div className={`form-group has-feedback ${childAgeFeedback}`}>
									<label className="control-label" htmlFor={`room${i}_{j}_age`}>Age</label>
									<input className="form-control" id={`room${i}_{k}_age`} maxLength="2" size="2" type="text" value={child.age} onChange={this.handleChildChange.bind(this, 'age', i, k)} disabled/>
									<span className={`glyphicon form-control-feedback glyphicon-${childAgeGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
						</div>
					</div>	
				);
			}

			guestRooms.push(
				<div key={`guest-${i}`} className="room-form clearfix">					
					<h4>
						Room {i+1}
						<small className="hidden-sm hidden-xs"> {(i===0) ? this.props.roomName : ''}</small>
					</h4>
					{guestAdults}
					{guestChildren}
				</div>
			);					
		});

		return (
			<form onSubmit={this.handleSubmit.bind(this)}>
				<div className="agent-infor-form guest-details" style={{paddingBottom: "15px"}}>
					<h4 className="form-heading">1. Guest Details</h4>
					{guestRooms}	
				</div>
				<div className="agent-infor-form">
					<h4 className="form-heading">2. Contact Information</h4>
					<div className="form-body">
						<div className="row">
							<div className="col-md-12">
								<div className={`form-group has-feedback ${emailFeedback}`}>
									<label className="control-label" htmlFor="bill_email">{emailLabel}</label>
									<input className="form-control" id="bill_email" type="email" value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder="Email Address"/>
									<span className={`glyphicon form-control-feedback glyphicon-${emailGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-5">
            					<div className={`form-group has-feedback ${phoneFeedback}`}>
            						<label className="control-label no-wrap" htmlFor="bill_phone">{phoneLabel}</label>
            						<select className="form-control" id="bill_phone" aria-invalid="false" value={this.state.phone} onChange={this.handleChange.bind(this, 'phone')}>
            							{this.phoneNumbers}
            						</select>
            					</div>
            				</div>
							<div className="col-xs-7">
								<div className={`form-group has-feedback ${phoneFeedback}`}>
									<label>&nbsp;</label>
									<input className="phone form-control" maxLength="20" size="20" type="tel" value={this.state.tel} onChange={this.handleChange.bind(this, 'tel')} placeholder="Phone Number"/>
									<span className={`glyphicon form-control-feedback glyphicon-${phoneGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>            				
						</div>
					</div>
				</div>
				<div className="agent-infor-form">
					<h4 className="form-heading">3. Call Center Notes</h4>
					<div className="form-body">
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									<label className="control-label" htmlFor="guests-requests">Guest's Special Requests</label>
									<textarea className="form-control" id="guests-requests" rows="5" placeholder="Guest's Special Requests" value={this.state.guestSpecialRequests} onChange={this.handleChange.bind(this, 'guestSpecialRequests')}/>
								</div>
								<div className="form-group">
									<label className="control-label" htmlFor="agent-notes">Agent Notes</label>
									<textarea className="form-control" id="agent-notes" rows="5" placeholder="Agent Notes" value={this.state.agentNotes} onChange={this.handleChange.bind(this, 'agentNotes')}/>
								</div>
								<div className={`form-group select-wrapper has-feedback ${callcenterFeedback}`}>
									<label className="control-label" htmlFor="callcenter_number">{(callcenterGlyphIcon === 'remove') ? 'Call Center Phone Number cannot be blank' : 'Call Center Phone Number'}</label>
									<select className="form-control" id="callcenter_number" value={this.state.agentPhone} onChange={this.handleChange.bind(this, 'agentPhone')}>
										{this.callcenternumbers}
									</select>
									<span className={`glyphicon form-control-feedback glyphicon-${callcenterGlyphIcon}`} aria-hidden="true"></span>
								</div>	
							</div>
						</div>
					</div>
				</div>

				<div className="agent-infor-form billing-info-form">
					<h4 className="form-heading">4. Billing Information</h4>
					<div className="form-body">
						<div className="row">
							<div className="col-md-12">
								<div className={`form-group has-feedback ${addressFeedback}`}>
									<label className="control-label" htmlFor="bill_address1">{(addressGlyphIcon === 'remove') ? 'Billing address1 cannot be blank' : 'Address1'}</label>
									<input className="form-control" id="bill_addres1s" maxLength="50" size="50" type="text" value={this.state.address1} onChange={this.handleChange.bind(this, 'address1')} placeholder="Address1"/>
									<span className={`glyphicon form-control-feedback glyphicon-${addressGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group has-feedback">
									<label className="control-label" htmlFor="bill_address2">Address2</label>
									<input className="form-control" id="bill_address2" maxLength="50" size="50" type="text" value={this.state.address2} onChange={this.handleChange.bind(this, 'address2')} placeholder="Address2"/>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<div className={`form-group has-feedback ${cityFeedback}`}>
									<label className="control-label" htmlFor="bill_city">{(addressGlyphIcon === 'remove') ? 'Billing city cannot be blank' : 'City'}</label>
									<input className="form-control" id="bill_city" maxLength="50"size="50" type="text" value={this.state.city} onChange={this.handleChange.bind(this, 'city')} placeholder="City"/>
									<span className={`glyphicon form-control-feedback glyphicon-${cityGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>				
							<div className="col-md-6">		
								<div className={`form-group select-wrapper has-feedback ${countryFeedback}`}>
									<label className="control-label" htmlFor="bill_country">Country</label>
									<select className="form-control" id="bill_country" value={this.state.country} onChange={this.handleChange.bind(this, 'country')}>
										{this.countries}
									</select>
									<span className={`glyphicon form-control-feedback glyphicon-${countryGlyphIcon}`} aria-hidden="true"></span>
								</div>	
							</div>
						</div>				
						<div className="row">
							<div className="col-md-6 no-md-right-padding">
								<div className={`form-group select-wrapper has-feedback ${stateFeedback}`}>
									<label className="control-label" htmlFor="bill_state">State/Province</label>
									<select className="form-control state" id="bill_state" disabled={(states.length === 0) ? 'disabled' : ''} value={this.state.state} onChange={this.handleChange.bind(this, 'state')}>
										<option value="">Select One</option>
										{states}
									</select>
									<span className={`glyphicon form-control-feedback glyphicon-${stateGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
							<div className="col-md-6 no-md-left-padding">
								<div className={`form-group has-feedback ${zipCodeFeedback}`}>
									<label className="control-label no-wrap" htmlFor="bill_zip">ZIP/Postal Code</label>
									<input className="form-control zip" id="bill_zip" maxLength="10" size="10" type="text" value={this.state.zipCode} onChange={this.handleChange.bind(this, 'zipCode')} placeholder="Zip Code"/>
									<span className={`glyphicon form-control-feedback glyphicon-${zipCodeGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
						</div>											
					</div>
				</div>

				<div className="billing-address-form">
					<h4 className="form-heading">5. Payment Details</h4>
					<div className="form-body">
						<div className="row">

							<div className="col-md-6">
								<div className={`form-group has-feedback ${firstNameFeedback}`}>
									<label className="control-label" htmlFor="bill_first">{(firstNameGlyphIcon === 'remove') ? 'First name on credit card cannot be blank' : 'Cardholder First Name'}</label>
									<input className="form-control" id="bill_first" maxLength="20" size="20" type="text" value={this.state.firstName} onChange={this.handleChange.bind(this, 'firstName')} placeholder="Cardholder First Name" />
									<span className={`glyphicon form-control-feedback glyphicon-${firstNameGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
							<div className="col-md-6">
								<div className={`form-group has-feedback ${lastNameFeedback}`}>
									<label className="control-label" htmlFor="bill_last">{(lastNameGlyphIcon === 'remove') ? 'Last name on credit card cannot be blank' : 'Cardholder Last Name'}</label>
									<input className="form-control" id="bill_last" maxLength="20" size="20" type="text" value={this.state.lastName} onChange={this.handleChange.bind(this, 'lastName')} placeholder="Cardholder Last Name"/>
									<span className={`glyphicon form-control-feedback glyphicon-${lastNameGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<div className={`form-group has-feedback ${cardNumberFeedback}`}>
									<label className="control-label no-wrap" htmlFor="card_number">{cardNumberLabel}</label>
									<input className="form-control" id="card_number" maxLength="40" size="19" type="text" value={this.state.cardNumber} onChange={this.handleChange.bind(this, 'cardNumber')} placeholder="Debit/Credit Card"/>
									<span className={`glyphicon form-control-feedback glyphicon-${cardNumberGlyphIcon}`} aria-hidden="true"></span>
								</div>							
							</div>
							<div className="col-xs-10 col-md-6 hidden-xs hidden-sm">
								<label className="control-label no-wrap">&nbsp;</label>
								<ul className="card-images">
									<li className={`visa ${(this.state.cardType === 'visa') ? 'valid' : ''}`}></li>
									<li className={`master ${(this.state.cardType === 'master-card') ? 'valid' : ''}`}></li>
									<li className={`amex ${(this.state.cardType === 'american-express') ? 'valid' : ''}`}></li>
									<li className={`discover ${(this.state.cardType === 'discover') ? 'valid' : ''}`}></li>
								</ul>						
							</div>
						</div>
						<div className="row">
							<div className="col-xs-7 col-md-4">
								<div className={`form-group has-feedback ${cardCodeFeedback}`}>
									<label className="control-label no-wrap" htmlFor="card_verification">{cardCodeLabel}</label>
									<input className="form-control" id="card_verification" maxLength="4" minLength="3" size="4" type="text" value={this.state.cardSecurityCode} onChange={this.handleChange.bind(this, 'cardSecurityCode')} placeholder="Card Security Code"/>
									<span className={`glyphicon form-control-feedback glyphicon-${cardCoderGlyphIcon}`} aria-hidden="true"></span>
								</div>
							</div>	
							<div className="col-xs-5 col-md-2 whats-this">
								<label>&nbsp;</label>
								<a className="text-muted" id="cvc"><img src="/img/cvv2.jpg" alt=""/>What's this</a>
							</div>
							<div className="col-md-6 col-xs-12">
								<div className="row">
									<div className="col-xs-6  no-xs-right-padding">
										<div className={`form-group expiration select-wrapper has-feedback ${cardMonthFeedback}`}>
											<label className="control-label no-wrap" htmlFor="card_month">{expDateLabel}</label>
											<select className="form-control exp-date date-month" id="card_month" value={this.state.cardMonth} onChange={this.handleChange.bind(this, 'cardMonth')}>
												<option value="">Month</option>
												{this.cardMonthes}
											</select>
											<span className={`glyphicon form-control-feedback glyphicon-${cardMonthGlyphIcon}`} aria-hidden="true"></span>
										</div>								
									</div>
									<div className="col-xs-6 no-xs-left-padding">
										<div className={`form-group expiration select-wrapper has-feedback ${cardYearFeedback}`}>
											<label className="hide-label" htmlFor="card_year">&nbsp;</label>
											<select className="form-control exp-date date-year" id="card_year" value={this.state.cardYear} onChange={this.handleChange.bind(this, 'cardYear')}>
												<option value="">Year</option>
												{this.cardYears}
											</select>
											<span className={`glyphicon form-control-feedback glyphicon-${cardYearGlyphIcon}`} aria-hidden="true"></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-red btn-lg btn-block" disabled={(this.state.checkoutable === true) ? '' : 'disabled'}>Agree &amp; Book this room for {numeral(this.props.data.summary.currentTotal).format()}</button>
				</div>
			</form>
		);
	}
}

export default CheckoutForm;
