import React, { Component, PropTypes } from 'react';
import ReactStars from 'react-stars';
import ImageGallery from 'react-image-gallery';
import numeral from 'numeral';
import $ from 'jquery';
import Collapsible from '../../../widgets/Collapsible';
import "react-image-gallery/styles/css/image-gallery.css";
require("./_panel.css");

const SHOWABLE_MAX_ROOMS = 10;

class Pane extends Component {	
    constructor(props) {
        super(props);
        this.state = {
        	imgCount: 0,
        	loadedImages: false,
        	selectedId: 0,
        	expanded: false
        };
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handlePaneSize = this.handlePaneSize.bind(this);
        numeral.defaultFormat('$0,0.');
    }

    componentWillReceiveProps() {
    	// this.setState({
    	// 	imgCount: 0
    	// })
    }

    handleImageLoad(e) {
    	let imgCount = (this.state.selectedId !== this.props.selectedItem.id) ? 1 : this.state.imgCount + 1;
    	this.setState({
    		selectedId: this.props.selectedItem.id,
    		imgCount: imgCount,
    		loadedImages: false
    	});

    	if(imgCount === this.props.selectedItem.images.length) {
    		this.setState({
    			selectedId: this.props.selectedItem.id,
    			loadedImages: true,
    			imgCount: 0
    		});
    	}
    }

	handlePaneSize() {
		let expanded = this.state.expanded;
		this.setState({
			expanded: !expanded
		},() => {
			$("#panel").animate({
				width: (expanded === false) ? "900px" : "675px"
			}, 400);
		});
	}

	render() {	
		// console.log(this.props.selectedItem);		
		if(this.props.selectedItem === undefined || this.props.selectedItem === null || this.props.open === false) {
			return null;
		}

		let sections = [];
		let fullAddress = this.props.selectedItem.address1;
		if(this.props.selectedItem.address2) {
			fullAddress += " " + this.props.selectedItem.address2;
		}
		fullAddress += ", " + this.props.selectedItem.cityName + ", " + this.props.selectedItem.stateCode + " " + this.props.selectedItem.zipCode;// + ", " + this.props.selectedItem.countryCode;
		let tmp_providers = (this.props.selectedItem.providerResults !== undefined) ? this.props.selectedItem.providerResults : [];
		
		let providers = [];
		let expedia_provider = null;
		for(let i = 0; i < tmp_providers.length; i++){
			if(tmp_providers[i].name === 'Expedia'){
				expedia_provider = tmp_providers[i];
			}else{
				providers.push( tmp_providers[i] );
			}
		}

		if (expedia_provider != null) {
            providers.push(expedia_provider);
        }

		if (!this.props.selectedItem.descriptions){
            this.props.selectedItem.descriptions = [];
		}

        if (!this.props.selectedItem.propertyAmenities){
            this.props.selectedItem.propertyAmenities = [];
        }

		if(providers.length > 0) {
			// Preferred Provider always on top
			let tmp = null;
			for(let i=0; i<providers.length; i++) {
				if((providers[i] !== null) && (this.props.selectedItem.preferredProviderId === providers[i].providerId)){
					tmp = providers[i];
					providers[i] = providers[0];
					providers[0] = tmp;
				}
			}

			providers.forEach((provider, index) => {
				let roomRows = [];
				let moreRooms = [];
				provider.rooms.forEach((room, idx) => {
					//decode cancellationPolicy text
					let d_textara=document.createElement("textarea");
					d_textara.innerHTML=room.cancellationPolicy;
					room.cancellationPolicy=d_textara.value;

					let cancel_text = 'Cancellation policy not available';
					if( room.cancellationPolicy !== ''){
						cancel_text = room.cancellationPolicy;
					}
					
					let roomDiv = (
						<div className="row">
							<div className="col-md-12 no-border">
								<div className="row">
									<div className="col-md-5">
										<span><b> {room.name} </b></span><br/>
										<span>{room.description}</span>
									</div>
									<div className="col-md-4">

                                        {
                                            (room.amenities && room.amenities.length > 0) ?
                                                (
													<ul className="room-amenities">
														<li className="bold">Included FREE:</li>
                                                        {room.amenities.map((amenity, i) =>
															<li key={`amenity-${idx}-${i}`} className="loc-bottom-header">{amenity}</li>
                                                        )}
													</ul>

                                                ) : ''
                                        }
									</div>
									<div className="col-md-2 text-right room-price" style={{paddingTop: '6px'}}>
                                    {(room.hasPromo && room.priceBeforePromo && room.priceBeforePromo > 0)?
										<label className="strikeout">${parseInt(room.priceBeforePromo, 10)}</label>
                                        : ''
                                    }
										<span>${parseInt(room.price, 10)}</span>

                                        {
                                        	(room.roomsAvailable > 0 && room.roomsAvailable < 10) ?
										<div className="hurry">Just {room.roomsAvailable} rooms left at this low rate!</div>
										: '' }

									</div>
									<div className="col-md-1 text-right"><a className="btn btn-red btn-small btn-room-book" onClick={()=>this.props.handleBook(room)}>Book</a></div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<div className="clearfix room-details">
											{(this.props.isSelectedNew === true) ?
												(
													<Collapsible key={`details-${index}-${idx}`} trigger="View details &raquo;">
													{
														<p>{cancel_text}</p>
													}	
													</Collapsible>
												) : ''
											}
											{(room.hasPromo) ? (<div className="promo_text">{room.promoText}</div>) : ''}
										</div>
									</div>
								</div>
								<hr/>			
							</div>
						</div>
					);
					if(idx < SHOWABLE_MAX_ROOMS) {
						roomRows.push(<div key={`room-${index}-${idx}`}>{roomDiv}</div>);
					}else {
						moreRooms.push(<div key={`room-${index}-${idx}`}>{roomDiv}</div>);
					}
				});

				let preferredClass = (this.props.selectedItem.preferredProviderId === provider.providerId) ? 'preferred-provider' : '';
				sections.push(
					<div key={`section-${index}`} className={preferredClass}>
						<Collapsible counter={index} trigger={provider.name} handleTriggerClick={()=>this.props.handleTriggerClick(provider)} open={provider.open} secondRequest={this.props.secondRequest}>
							{
								(provider.name === 'PricelineCUG' && this.props.secondSearch)?
								(
									<div className='spineer_overlay'><div className='loading_label'><i className="fa fa-spinner fa-spin-custom"></i> Searching for PricelineCUG. Please wait ...</div></div>
								) : ''
							}

                            {
                                (provider.name === 'GetARoom' && this.props.secondSearch)?
                                    (
										<div className='spineer_overlay'><div className='loading_label'><i className="fa fa-spinner fa-spin-custom"></i> Searching for GetARoom. Please wait ...</div></div>
                                    ) : ''
                            }

							{
								((provider.name === 'PricelineCUG' || provider.name === 'GetARoom') && this.props.secondSearchFail)?
								(
									<div className='spineer_overlay'><div className='fail_label'>No Availability</div></div>
								) : ''
							}
							
							{roomRows}
							{
								(moreRooms.length > 0) ? 
								(
									<div className="more-showable-rooms">
										<Collapsible trigger="Show more rooms" location="bottom" triggerWhenOpen="Hide more rooms">
											{moreRooms}
										</Collapsible>
									</div>
								) : ''
							}
						</Collapsible>

					</div>
				);
			});
		}

		let _descriptions=this.props.selectedItem.descriptions;
		_descriptions.sort(function(a, b){
			if(a.descriptionType && b.descriptionType) {
		    	if(a.descriptionType < b.descriptionType) return -1;
		    	if(a.descriptionType > b.descriptionType) return 1;
		    }
		    return 0;
		});

		let _general=null;
		let _property=null;
		let _amenities=null;
		for(let i=0; i<_descriptions.length; i++){
			if(_descriptions[i].descriptionType === "General"){
				_general=_descriptions[i];
				_descriptions.splice(i, 1);
			}else if(_descriptions[i].descriptionType === "Property Features"){
				_property=_descriptions[i];
				_descriptions.splice(i, 1);
			}else if(_descriptions[i].descriptionType === "Room Amenities"){
				_amenities=_descriptions[i];
				_descriptions.splice(i, 1);
			}
		}
		if(_amenities)
			_descriptions.push(_amenities);
		if(_property)
			_descriptions.push(_property);
		if(_general)
			_descriptions.push(_general);

		_descriptions.reverse();

		let expandedClass = "expanded";
		let expandedLabel = "Expand";
		if(this.state.expanded === true) {
			expandedClass = "";
			expandedLabel = "Shrink";
		}

		return (
			<div className="item-panel" id="panel" style={{height: this.props.height - 15}}>
				<div className="item-panel-header">
					<div className="pane-btns">
						<a className="close" title="Close" onClick={this.props.closePanel}></a>
						<a className={`size-change ${expandedClass}`} title={expandedLabel} onClick={this.handlePaneSize}></a>
					</div>
					<h1 className="hotel-name">{this.props.selectedItem.hotelName}</h1>
				</div>
				<div className="wrapper" style={{borderBottom: "0"}}>	
					<div className="top-header">
						<div className="">
							<div className="hotel-infos">
								<div className="row">
									<div className="col-lg-12 mt10">
										<div className="stars">
											<div className="rating">
												<ReactStars
													count={5}
													size={18}
													value={this.props.selectedItem.starRating}
													edit={false}
													color1={'#cccccc'}
													color2={'#d23a2a'} />
											</div>	
										</div>								
									</div>
									<div className="col-lg-12 mb10">
										<div className="hotel-info">
											{fullAddress}
										</div>
									</div>
								</div>
							</div>
							<div className="clearfix"></div>
						</div>
					</div>
					<div className="image-slider">
						<div className={(this.state.selectedId !== this.props.selectedItem.id || this.state.loadedImages === false) ? 'images-loading-wrapper' : ''}>
							<ImageGallery
								items={this.props.selectedItem.images}
								autoPlay={true}
								showPlayButton={false}
								showFullscreenButton={false}
								showThumbnails={true}
								showBullets={false}
								onImageLoad={this.handleImageLoad}
								slideDuration={700}
								slideInterval={8000}/>					
						</div>
						{
							(this.state.selectedId !== this.props.selectedItem.id || this.state.loadedImages === false) ?
							(
								<div className="image-loading"><i className="fa fa-spinner fa-spin-custom"></i> Loading images...</div>
							) : ''
						}
					</div>
					{ (this.props.selectedItem.providerResults && sections.length) ?
						<div className="section-rooms">
							<div className="row">
								<h2 className="col-md-12 header-sections">Available Rooms & Rates</h2>
							</div>

							<div className="accordion">
								{sections}
							</div>
						</div>
                     : '' }

                     { (this.props.selectedItem.descriptions && this.props.selectedItem.descriptions.length) ?
	                    <div className="row">
							<div className="col-lg-6 col-md-6">
								<br/>
								<h2 className="short_description">About This Hotel</h2>
							</div>
						</div>
					: '' }

					{ (this.props.selectedItem.descriptions && this.props.selectedItem.descriptions.length) ?
						<div className="section-location">
							<div className="row">
								<div className="col-lg-12 col-md-12">
									<div className="wrapper">
									{
										_descriptions.map((item, i) =>
										<div key={`desc-${i}`}>
											<h3 className="loc-bottom-header">{item.descriptionType}</h3>
											<p>{item.descriptionValue}</p>
										</div>
										)
									}
									</div>
								</div>
							</div>
						</div>
						: ''
					}
					
					{ (this.props.selectedItem.propertyAmenities && this.props.selectedItem.propertyAmenities.length) ?
						<div className="row" style={{marginTop: "20px"}}>
							<div className="col-lg-12 col-md-12">
									<div key="0" className="row">
										<div className="col-lg-12 col-md-12">
											<div className="wrapper" style={{borderBottom: "0"}}>
												<h2 className="loc-bottom-header">Hotel Amenities</h2>
													<br/>
												<ul className="col-lg-12 col-md-12">
												{this.props.selectedItem.propertyAmenities.map((item, ii) =>
													<li className="col-md-6 amenity-list" key={`amentity-${ii}`}>{item.amenityName}</li>
												)}
												</ul>
											</div>
										</div>
									</div>
							</div>
						</div>
					: '' }
					</div>
			</div>
		);
	}
}
Pane.contextTypes = {
	router: PropTypes.object.isRequired
};
export default Pane;
