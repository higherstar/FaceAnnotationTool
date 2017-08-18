import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import AccountReducer from './AccountReducer';

const rootReducer = combineReducers({
  AccountReducer,
  routing
});

export default rootReducer;
