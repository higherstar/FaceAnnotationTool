import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { persistState } from 'redux-devtools';
import rootReducer from '../reducers';

const logger = createLogger({
  level: 'info',
  collapsed: true
});

const router = routerMiddleware(browserHistory);

/**
 * Creates a preconfigured store.
 *
 * @param {initialState} initialState The initial state
 * @return {store} {*} Return the store object
 */
export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, router, logger),
      persistState(
        window.location.href.match(
          /[?&]debug_session=([^&]+)\b/
        )
      )
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
