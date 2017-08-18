import CheckoutConstants from '../constants/CheckoutConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
	resultsData: {},
	error: null
});

/**
 * Return the results object based on the API data.
 *
 * @param {state} state The initialState of the object
 * @param {action} action The action the user wishes to perform
 * @return {state} {*} Returns the original state or the featured articles object
 * @constructor
 */
function CheckoutReducer(state = initialState, action) {
	switch (action.type) {
		case CheckoutConstants.BOOK:
			return Object.assign({}, state, {
				resultsData: {},
				error: null
			});
		case CheckoutConstants.BOOK_SUCCESS:
			return Object.assign({}, state, {
				resultsData: action.response,
				error: null
			});
		case CheckoutConstants.BOOK_ERROR:
			return Object.assign({}, state, {
				resultsData: {},
				error: action.error
			}); 

		case CheckoutConstants.CANCEL:
			return Object.assign({}, state, {
				resultsData: {},
				error: null
			});
		case CheckoutConstants.CANCEL_SUCCESS:
			return Object.assign({}, state, {
				resultsData: action.response,
				error: null
			});
		case CheckoutConstants.CANCEL_ERROR:
			return Object.assign({}, state, {
				resultsData: {},
				error: action.error
			}); 

		case CheckoutConstants.PRE_CANCEL:
			return Object.assign({}, state, {
				resultsData: {},
				error: null
			});
		case CheckoutConstants.PRE_CANCEL_SUCCESS:
			return Object.assign({}, state, {
				resultsData: action.response,
				error: null
			});
		case CheckoutConstants.PRE_CANCEL_ERROR:
			return Object.assign({}, state, {
				resultsData: {},
				error: action.error
			}); 			

		default:
			return state;
	}
}

export default CheckoutReducer;
