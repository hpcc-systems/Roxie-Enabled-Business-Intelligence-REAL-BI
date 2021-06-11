import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './features';

const initialState = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV !== 'production'
      ? window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 })
      : noop => noop,
  ),
);

export default store;
