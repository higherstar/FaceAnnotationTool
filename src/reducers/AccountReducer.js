import AccountConstants from '../constants/AccountConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
	userData: {},
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
function AccountReducer(state = initialState, action) {
	switch (action.type) {
		case AccountConstants.LGOIN:
			return Object.assign({}, state, {
				userData: {},
				error: null
			});
		case AccountConstants.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				userData: action.response,
				error: null
			});
		case AccountConstants.LOGIN_ERROR:
			return Object.assign({}, state, {
				userData: {},
				error: action.error
			}); 

		default:
			return state;
	}
}

export default AccountReducer;
