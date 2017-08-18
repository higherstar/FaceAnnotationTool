import React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import ResultsPage from './containers/ResultsPage';
import CheckoutPage from './containers/CheckoutPage';
import ConfirmPage from './containers/ConfirmPage';
import CancelPage from './containers/CancelPage';
import CancelBookingPage from './containers/CancelBookingPage';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

let requireAuth = (nextState, replace) => {
  if(!localStorage.getItem('Token') || !localStorage.getItem('username')){
    replace({
      pathname: '/',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};


export default (
	<Router history={browserHistory}>
		<Route path="/" component={LoginPage} />
		<Route path="/search" component={HomePage} onEnter={requireAuth} />
		<Route path="/checkout" component={CheckoutPage} onEnter={requireAuth} />
		<Route path="/results" component={ResultsPage} onEnter={requireAuth} history={ history } />
		<Route path="/confirm" component={ConfirmPage} onEnter={requireAuth} />
        <Route path="/cancel" component={CancelPage} onEnter={requireAuth} />
        <Route path="/cancelbooking/:code" component={CancelBookingPage} onEnter={requireAuth} />
	</Router>
);