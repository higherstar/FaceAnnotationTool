import React, {Component} from 'react';

let timeoutHandler = null;
class FilterNameInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterName: ''
		};
		timeoutHandler = null;
		this.handleFilterName = this.handleFilterName.bind(this);
	}

	handleFilterName(e) {
		/*
			On keypress, don't filter, set timeout for 200ms, on next keypress, cancel the timeout and set a new timeout.
			The function in the timeout will filter.
			That way if they user is typing they don't get delay until they break for 200ms		
		*/
		let v = e.target.value;
		let _this = this;
		this.setState({
			filterName: v
		});

		clearTimeout(timeoutHandler);
		timeoutHandler = setTimeout(function() {
			_this.props.handleFilterName(v.toLowerCase());
		}, 200);
	}

	render() {
		return (
			<div className="filterby row">
				<div className="col-md-12">
					<input type="text" value={this.state.filterName} placeholder="Filter by name" onChange={this.handleFilterName} />
				</div>
			</div>
		);
	}
}

export default FilterNameInput;