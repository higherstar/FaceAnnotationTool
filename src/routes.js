import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import HomePage from './containers/Home/index';
import LoginPage from './containers/LoginPage';

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
		<Route path="/" component={LoginPage}/>
		<Route path="/annotation" component={HomePage} onEnter={requireAuth} />
	</Router>
);