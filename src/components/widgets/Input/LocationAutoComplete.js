import React, {Component} from 'react';

class LocationAutoComplete extends Component {
	constructor(props) {
		super(props);
		this.autocomplete = null;
	}

	componentDidMount() {
		let google = window.google;
		this.autocomplete = new google.maps.places.Autocomplete(this.refs.location, {
			type: ['geocode']
		});

		let _this = this;
		this.autocomplete.addListener('place_changed', function(){
			let place = _this.autocomplete.getPlace();
			if (place !== undefined) {
		        if (place.address_components !== undefined) {
					if (_this.props.onPlaceSelected) {	
						let place = _this.autocomplete.getPlace();
						_this.props.onPlaceSelected(place, _this.refs.location.value);
					}
				}else {
					// SEO Company Orlando FL, Spessard L. Holland East-West Expressway, Orlando, FL, United States
					var autocompleteService = new google.maps.places.AutocompleteService();
					var d = { input: _this.refs.location.value, offset: _this.refs.location.value.length };

			        autocompleteService.getPlacePredictions(d, function (list, status) {
			            if (list === null || list.length === 0) {
			            	return null;
			            }

			            var placesService = new google.maps.places.PlacesService(_this.refs.location);
			            var ref = { 'reference': list[0].reference }
			            placesService.getDetails(ref, function (detailsResult, placesServiceStatus) {
			                if (placesServiceStatus === google.maps.GeocoderStatus.OK) {
			                	_this.props.onPlaceSelected(detailsResult, _this.refs.location.value);
			                }
			            });
			        });
				}
			}
		});
	}

	render() {
		return (
			<input 
				id={this.props.id}
				name={this.props.id}
				className={this.props.className}
				type="text"
				ref="location"
				defaultValue={this.props.value}
				required={this.props.required}
				placeholder={this.props.placeholder}
				onChange={this.props.onChange}/>
		);
	}
}

export default LocationAutoComplete;