import React, { Component } from 'react';
import $ from 'jquery';
import 'react-leaflet';
import './_mapContainer.css';

let L = window.L;
const redIcon = window.L.Icon.Default.extend({
	options: {
		iconUrl: 'img/marker.png',
		iconRetinaUrl: 'img/marker-retinal.png',
		shadowUrl: "img/marker-shadow.png",
		imagePath: '/'
	}
});

const markerPin = new redIcon();
let markers = [];
let mapContainer = null;
	
class MapContainer extends Component {
	constructor(props) {
		super(props);
		// When hitting back button on browser to return to results, the map should be initialized
        mapContainer = null;
        markers = [];

		this.initMarkers = this.initMarkers.bind(this);
		this.initMapFromMarker = this.initMapFromMarker.bind(this);
		this.initMapWithHotel = this.initMapWithHotel.bind(this);
		this.destroyMap = this.destroyMap.bind(this);
	}	

	destroyMap() {
		if(mapContainer !== null) {
			this._clearMarkers();
			mapContainer.remove();
			mapContainer = null;
		}		
	}

	initMarkers(filtered, all, centerPos) {
		if(filtered.length === 0) {
			if(all && all.length > 0) {
				if(mapContainer === null) {
					this._createMap(centerPos);
				}
				
				this._clearMarkers();
				mapContainer.setView(centerPos, 12);  
			}else if(mapContainer !== null) {
				this._clearMarkers();
				mapContainer.remove();
				mapContainer = null;
			}
		}else {
			if(mapContainer === null) {
				let firstHotel = filtered[0];
				this._createMap([firstHotel.latitude, firstHotel.longitude])
			}
			
			this._clearMarkers();
			filtered.forEach((item) => {
				let marker = L.marker([item.latitude, item.longitude], {icon: markerPin, title: item.hotelName, alt: item.id}).addTo(mapContainer);
				let _this=this;
				marker.on('click', function(e){
					_this.props.handleSelectHotelFromMarker(item, this);
				});
				markers.push(marker);
			});
		}		
	}

	initMapFromMarker(item, marker) {
		mapContainer.setView([item.latitude, item.longitude], 16);
		setTimeout(function(){
			let paneWidth = document.getElementById('panel').offsetWidth;
			let offsetLeft = (paneWidth === 675) ? -338 : -450;
		    mapContainer.panBy([offsetLeft, 0], {animate: true, noMoveStart: true});
			marker.bindPopup($("#selected_item").html()).openPopup();
		}, 300);		
	}

	initMapWithHotel(item) {
		let panel = document.getElementById('panel');
		if(panel) {
			// If already selected an item, it will popup marker, pany by.
			mapContainer.setView([item.latitude, item.longitude], 16);
			markers.forEach((marker) => {
				let markerID = marker.options.alt;
				if (markerID === item.id){
					marker.bindPopup($("#selected_item").html()).openPopup();
				}
			});
			
			setTimeout(function(){
				let paneWidth = document.getElementById('panel').offsetWidth;
				let offsetLeft = (paneWidth === 675) ? -338 : -450;
				mapContainer.panBy([offsetLeft, 0], {animate: true, noMoveStart: true});
	        }, 300);		
		}else {
			// If didn't select any item, it will only set center map.
			mapContainer.setView([item.latitude, item.longitude], 12);			
		}	
	}

	_createMap(center) {
		mapContainer = L.map('map-container');
		mapContainer = mapContainer.setView(center, 12);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.streets'
		}).addTo(mapContainer);
	}

	_clearMarkers() {
        markers.forEach((marker) => {
            marker.remove();
        });

        markers = [];
	}

	render() {
		return (
			<div id="map-container" style={{height: this.props.height}}></div>
		);
	}
}

export default MapContainer;