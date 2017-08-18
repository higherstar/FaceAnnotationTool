import ResultsConstants from '../constants/ResultsConstants';
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
function ResultsReducer(state = initialState, action) {
	switch (action.type) {
		case ResultsConstants.GET_PROPERTY:
			return Object.assign({}, state, {
				resultsData: {},
				error: null
			});
		case ResultsConstants.GET_PROPERTY_SUCCESS:
			return Object.assign({}, state, {
				resultsData: action.response,
				error: null
			});
		case ResultsConstants.GET_PROPERTY_ERROR:
			return Object.assign({}, state, {
				resultsData: {},
				error: action.error
			});

        case ResultsConstants.GET_PROPERTY_DETAILS:
            return Object.assign({}, state, {
                resultsData: {},
                error: null
            });
        case ResultsConstants.GET_PROPERTY_DETAILS_SUCCESS:
            return Object.assign({}, state, {
                resultsData: action.response,
                error: null
            });
        case ResultsConstants.GET_PROPERTY_DETAILS_ERROR:
            return Object.assign({}, state, {
                resultsData: {},
                error: action.error
            });

        case ResultsConstants.GET_AUTOCOMPLETE_PROPERTIES:
			return Object.assign({}, state, {
				propertiesData: {},
				error: null
			});
		case ResultsConstants.GET_AUTOCOMPLETE_PROPERTIES_SUCCESS:
			return Object.assign({}, state, {
				propertiesData: action.response,
				error: null
			});
		case ResultsConstants.GET_AUTOCOMPLETE_PROPERTIES_ERROR:
			return Object.assign({}, state, {
				propertiesData: {},
				error: action.error
			}); 

		case ResultsConstants.GET_PROVIDER_SEARCH:
			return Object.assign({}, state, {
				providersData: {},
				error: null
			});
		case ResultsConstants.GET_PROVIDER_SEARCH_SUCCESS:
			return Object.assign({}, state, {
				providersData: action.response,
				error: null
			});
		case ResultsConstants.GET_PROVIDER_SEARCH_ERROR:
			return Object.assign({}, state, {
				providersData: {},
				error: action.error
			});

		case ResultsConstants.GET_PROVIDERS:
			return Object.assign({}, state, {
				providersData: {},
				error: null
			});
		case ResultsConstants.GET_PROVIDERS_SUCCESS:
			return Object.assign({}, state, {
				providersData: action.response,
				error: null
			});
		case ResultsConstants.GET_PROVIDERS_ERROR:
			return Object.assign({}, state, {
				providersData: {},
				error: action.error
			});
		case ResultsConstants.GET_PREBOOK_SUCCESS:
			return Object.assign({}, state, {
				preBookData: action.response,
				error: null
			});
		case ResultsConstants.GET_PREBOOK_ERROR:
			return Object.assign({}, state, {
				preBookData: {},
				error: action.error
			}); 
		
		default:
			return state;
	}
}

export default ResultsReducer;
