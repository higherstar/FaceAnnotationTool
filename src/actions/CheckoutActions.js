import CheckoutConstants from '../constants/CheckoutConstants';
import ApiPathConstants from '../constants/ApiPathConstants';
import _ from 'lodash';

let CheckoutActions = {
	bookRequest: function() {
		return {
			type: CheckoutConstants.BOOK
		};
	},

	bookError: function(error) {
		return {
			error,
			type: CheckoutConstants.BOOK_ERROR
		};
	},

	bookSuccess: function(response) {
		return {
			response,
			type: CheckoutConstants.BOOK_SUCCESS
		};
	},

	book: function(data, cb){
		let _obj = this;
		return dispatch => {
			fetch(ApiPathConstants.getApiPath() + 'api/Book', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                },
                body: JSON.stringify(data)
            })
			.then(response => {
				response.json().then(function(res) {
					dispatch(_obj.bookSuccess(res));
					if(cb != null){
						cb(res);
					}
        		});
			})
			.catch(error => {
				dispatch(_obj.bookError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	},

	preCancelRequest: function() {
		return {
			type: CheckoutConstants.PRE_CANCEL
		};
	},

	preCancelError: function(error) {
		return {
			error,
			type: CheckoutConstants.PRE_CANCEL_ERROR
		};
	},

	preCancelSuccess: function(response) {
		return {
			response,
			type: CheckoutConstants.PRE_CANCEL_SUCCESS
		};
	},

	preCancel: function(itineraryCode, cb){
		let _obj = this;
		return dispatch => {
			fetch(ApiPathConstants.getApiPath() + 'api/PreCancel?itineraryCode=' + itineraryCode, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                }
            })
			.then(response => {
				if(response.status === 200) {
					response.json().then(function(res) {
						dispatch(_obj.preCancelSuccess(res));
						if(cb != null){
							cb(res);
						}					
	        		});
				}else {
					dispatch(_obj.preCancelError(response));
					if(cb != null){
						cb(response);
					}
				}
			})
			.catch(error => {
				dispatch(_obj.preCancelError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	},

	cancelRequest: function() {
		return {
			type: CheckoutConstants.CANCEL
		};
	},

	cancelError: function(error) {
		return {
			error,
			type: CheckoutConstants.CANCEL_ERROR
		};
	},

	cancelSuccess: function(response) {
		return {
			response,
			type: CheckoutConstants.CANCEL_SUCCESS
		};
	},

	cancel: function(itineraryCode, cb){
		let _obj = this;
		return dispatch => {
			fetch(ApiPathConstants.getApiPath() + 'api/Cancel?itineraryCode=' + itineraryCode , {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token_Type') + " " + localStorage.getItem('Token')
                }
            })
			.then(response => {
				if(response.status === 200) {
					response.json().then(function(res) {
						dispatch(_obj.cancelSuccess(res));
						if(cb != null){
							cb(res);
						}					
	        		});
				}else {
					dispatch(_obj.cancelError(response));
					if(cb != null){
						cb(response);
					}
				}
			})
			.catch(error => {
				dispatch(_obj.cancelError(error));
				if(cb != null){
					cb(error);
				}
			});
		};
	}
};

export default CheckoutActions;
