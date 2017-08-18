import ResultsConstants from '../constants/ResultsConstants';
import ApiPathConstants from '../constants/ApiPathConstants';
import _ from 'lodash';

let ResultsActions = {

	getPropertyError: function(error) {
		return {
			error,
			type: ResultsConstants.GET_PROPERTY_ERROR
		};
	},

	getPropertySuccess: function(response) {
		return {
			response,
			type: ResultsConstants.GET_PROPERTY_SUCCESS
		};
	},

	getProperty: function(data, cb){
		let _obj = this;
		return dispatch => {
			fetch(ApiPathConstants.getApiPath() + 'api/Property?latitude=' + data.latitude + '&longitude=' + data.longitude, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
				}
			})
			.then(response => {
				if(response.ok){
					response.json().then(function(res) {
						dispatch(_obj.getPropertySuccess(res));
						if(cb != null){
							cb();
						}					
	        		});
	        	}else{
	        		response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.getPropertyError(_error));
						if(cb != null){
							cb(_error);
						}
					});
	        	}
			})
			.catch(error => {
				dispatch(_obj.getPropertyError(error));
				if(cb != null){
					cb();
				}
			});
		};
	},

    getPropertyDetailsError: function(error) {
        return {
            error,
            type: ResultsConstants.GET_PROPERTY_DETAILS_ERROR
        };
    },

    getPropertyDetailsSuccess: function(response) {
        return {
            response,
            type: ResultsConstants.GET_PROPERTY_DETAILS_SUCCESS
        };
    },

    getPropertyDetails: function(data, cb){
        let _obj = this;
        return dispatch => {
            fetch(ApiPathConstants.getApiPath() + 'api/PropertyDetails?id=' + data.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                }
            })
            .then(response => {
            	if(response.ok){
                    response.json().then(function(res) {
                        dispatch(_obj.getPropertyDetailsSuccess(res));
                        if(cb != null){
                            cb(res);
                        }
                    });
                }else{
                	response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.getPropertyDetailsError(_error));
						if(cb != null){
							cb(_error);
						}
					});
                }
            })
            .catch(error => {
                dispatch(_obj.getPropertyDetailsError(error));
                if(cb != null){
                    cb();
                }
            });
        };
    },

    getAutocompletePropertiesError: function(error) {
		return {
			error,
			type: ResultsConstants.GET_AUTOCOMPLETE_PROPERTIES_ERROR
		};
	},

	getAutocompletePropertiesSuccess: function(response) {
		return {
			response,
			type: ResultsConstants.GET_AUTOCOMPLETE_PROPERTIES_SUCCESS
		};
	},

	getAutocompleteProperties: function(search, cb){
		let _obj = this;
		return dispatch => {
			fetch(ApiPathConstants.getApiPath() + 'api/AutocompleteProperty?search=' + search, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
				}
			})
			.then(response => {
				if(response.ok){
					response.json().then(function(res) {
						dispatch(_obj.getAutocompletePropertiesSuccess(res));
						if(cb != null){
							cb();
						}					
	        		});
	        	}else{
	        		response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.getAutocompletePropertiesError(_error));
						if(cb != null){
							cb(_error);
						}
					});
	        	}
			})
			.catch(error => {
				dispatch(_obj.getAutocompletePropertiesError(error));
				if(cb != null){
					cb();
				}
			});
		};
	},

    getProviderSearchsError: function(error) {
		return {
			error,
			type: ResultsConstants.GET_PROVIDER_SEARCH_ERROR
		};
	},

    getProviderSearchSuccess: function(response) {
		return {
			response,
			type: ResultsConstants.GET_PROVIDER_SEARCH_SUCCESS
		};
	},

    getProviderSearch: function(search, cb){
		let _obj = this;
		return dispatch => {
            fetch(ApiPathConstants.getApiPath() + 'api/Search', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                },
                body: JSON.stringify(search)
            })
			.then(response => {
				if(response.ok){
					response.json().then(function(res) {
						dispatch(_obj.getProviderSearchSuccess(res));
						if(cb != null){
							cb(res);
						}					
	        		});
				}else{
					response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.getProviderSearchsError(_error));
						if(cb != null){
							cb(_error);
						}
					});
				}
			})
			.catch(error => {
				dispatch(_obj.getProviderSearchsError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	},

	preBookError: function(error) {
		return {
			error,
			type: ResultsConstants.GET_PREBOOK_ERROR
		};
	},

	preBookSuccess: function(response) {
		return {
			response,
			type: ResultsConstants.GET_PREBOOK_SUCCESS
		};
	},

	preBook: function(data, cb){
		let _obj = this;
		return dispatch => {
            fetch(ApiPathConstants.getApiPath() + 'api/PreBook', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                },
                body: JSON.stringify(data)
            })
			.then(response => {
				if(response.ok){
					response.json().then(function(res) {
						dispatch(_obj.preBookSuccess(res));
						if(cb != null){
							cb(res);
						}					
	        		});
				}else{
					response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.preBookError(_error));
						if(cb != null){
							cb(_error);
						}
					});
				}
			})
			.catch(error => {
				dispatch(_obj.preBookError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	},

    getProvidersError: function(error) {
		return {
			error,
			type: ResultsConstants.GET_PROVIDERS_ERROR
		};
	},

    getProvidersSuccess: function(response) {
		return {
			response,
			type: ResultsConstants.GET_PROVIDERS_SUCCESS
		};
	},

    getProviders: function(cb){
		let _obj = this;
		return dispatch => {
            fetch(ApiPathConstants.getApiPath() + 'api/Providers', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                }
            })
			.then(response => {
				if(response.ok){
					response.json().then(function(res) {
						dispatch(_obj.getProvidersSuccess(res));
						if(cb != null){
							cb(res);
						}					
	        		});
	        	}else{
	        		response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.getProvidersError(_error));
						if(cb != null){
							cb(_error);
						}
					});
	        	}
			})
			.catch(error => {
				dispatch(_obj.getProvidersError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	},

    postPreBookError: function(error) {
        return {
            error,
            type: ResultsConstants.POST_PREBOOK_ERROR
        };
    },

    postPreBookSuccess: function(response) {
        return {
            response,
            type: ResultsConstants.POST_PREBOOK_SUCCESS
        };
    },

    postPreBook: function(room, cb){
        let _obj = this;
        return dispatch => {
            fetch(ApiPathConstants.getApiPath() + 'api/PreBook', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                },
                body: JSON.stringify(room)
            })
			.then(response => {
				if(response.ok){
					response.json().then(function(res) {
						dispatch(_obj.preBookSuccess(res));
						if(cb != null){
							cb(res);
						}					
	        		});
	        	}else{
	        		response.json().then(function(res) {
						let _error={
							status: response.statusText,
							error: res
						};
						dispatch(_obj.preBookError(_error));
						if(cb != null){
							cb(_error);
						}
					});
	        	}
			})
			.catch(error => {
				dispatch(_obj.preBookError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	}
};

export default ResultsActions;
