import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import ResultsReducer from './ResultsReducer';
import AccountReducer from './AccountReducer';
import CheckoutReducer from './CheckoutReducer';

const rootReducer = combineReducers({
  ResultsReducer,
  AccountReducer,
  CheckoutReducer,
  routing
});

export default rootReducer;
