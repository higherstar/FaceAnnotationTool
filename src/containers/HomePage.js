import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Header from './Common/Header';
import Footer from './Common/Footer';
import SearchForm from '../components/widgets/Form/SearchForm';
import {ResultsActions} from '../actions';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			propertiesData: []
		};

		this.getAutocompleteProperties = this.getAutocompleteProperties.bind(this);
		this.goResultsPage = this.goResultsPage.bind(this);
        this.gotoCancel = this.gotoCancel.bind(this);
	}

	getAutocompleteProperties(search) {
		if(search === '') {
			this.setState({
				propertiesData: []
			});
			return;
		}		
		this.props.getAutocompleteProperties({
			search: search,
			cb: () => {
				if(this.props.error === null) {
					this.setState({
						propertiesData: this.props.propertiesData
					})
				}
			}
		});
	}	

	goResultsPage(param) {
		this.context.router.push('/results?'+param);
	}

    gotoCancel(){
        this.context.router.push('/cancel');
    }

	render() {
		return (
			<div className="layout">
				<div className="wrapper no-sidebar">
					<Header/>
					<section>
						<div className="content-wrapper">
							<div className="container">
								<div className="row search-box">
									<div className="col-md-12">
										<SearchForm 
											hotelsAutocompleteData={this.state.propertiesData}
											getAutocompleteProperties={this.getAutocompleteProperties}
											goResultsPage={this.goResultsPage}/>	

										<div className="panel panel-primary">
											<div className="panel-heading">
												<h4>Existing Reservation</h4>
											</div>
											<div className="panel-body">
												<a className="cancel_link" onClick={this.gotoCancel}>Search existing reservation</a>
											</div>
										</div>
										<div className="panel panel-primary">
											<div className="panel-heading">
												<h4>Car Rental</h4>
											</div>
											<div className="panel-body">
												<a className="cancel_link" target="_blank" href="http://www.reservations.com/car-rentals/">Book a car</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<Footer/>
				</div>
			</div>
		);
	}
}

HomePage.contextTypes = {
	router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        propertiesData: state.ResultsReducer.propertiesData,
        error: state.ResultsReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAutocompleteProperties : (req) => {
            dispatch(ResultsActions.getAutocompleteProperties(req.search, req.cb));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
