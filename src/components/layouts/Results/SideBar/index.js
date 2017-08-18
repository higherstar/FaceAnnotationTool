import React, { Component } from 'react';
import numeral from 'numeral';
import LoadingOverlay from '../../../widgets/LoadingOverlay';
import FilterNameInput from '../../../widgets/Input/FilterNameInput';
import HotelItem from './HotelItem';

class SideBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterName: ''
		};
		this.handleFilterName = this.handleFilterName.bind(this);
	}

	handleFilterName(filterName) {
		this.setState({
			filterName: filterName
		});
	}

	render() {
		let rows = [];
		let sorts = [];
		let overlayClass = (this.props.sendingRequest) ? 'rcomui-overlay show' : 'rcomui-overlay';
		numeral.defaultFormat('$0,0.00');
		if(this.props.items && this.props.items.length > 0) {
			this.props.items.forEach((item, index) => {
				if(this.state.filterName === '' || item.hotelName.toLowerCase().includes(this.state.filterName) === true) {
					rows.push(
						<li key={`item-${index}`} className={(this.props.selectedItem && this.props.selectedItem.id === item.id)?'selected':''} id={(this.props.selectedItem && this.props.selectedItem.id === item.id)?'selected_item':''}>
							<HotelItem 
								index={index} 
								item={item} 
								handleSelectHotel={this.props.handleSelectHotel}/>							
						</li>	
					);		
				}
			});
		}

		["Distance", "Price", "Rating", "Promo"].forEach((item, index) => {
			let selected = (this.props.sortby === index) ? "selected" : "";
			sorts.push(
				<a key={`sort-${index}`} className={selected} onClick={()=>this.props.handleSort(index)}>{item}</a>
			);
		});

		return (
			<div id="sidebar" className="side-bar" style={{height: this.props.height}}>
	            <LoadingOverlay
	                overlayClass={overlayClass}
	                message="Searching for best hotel deals. Please wait..."
	            />							
				{
					(this.props.filterable === true) ?
					(
						<div className="bar-wrapper" style={{height: this.props.height}}>
							<FilterNameInput handleFilterName={this.handleFilterName}/>
							<div className="sortby">
								<span>Sorty by: </span>
								{sorts}
							</div>
							<ul>
				                { (rows.length > 0) ? rows : (<p className="error">No results for these filters.</p>) }
							</ul>
						</div>
					)
					:
					(this.props.loadingPageRequest === false) ? (<p className="error">There are no results matching your search.</p>) : ''
				}
			</div>
		);
	}
}

export default SideBar;
