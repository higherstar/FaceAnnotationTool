import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import routes from '../routes';

export default class Root extends Component {

  render() {
    const {store, history} = this.props;

    if (!this.props) {
      return null;
    }

    return (
      <Provider store={store}>
        <Router history={history} routes={routes}/>
      </Provider>
    );
  }
}
