import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {Provider} from 'react-redux';
import 'babel-polyfill';
import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {reducer as notificationsReducer} from 'reapop';
const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)
)(createStore);
const store = createStoreWithMiddleware(combineReducers({
  // reducer must be mounted as `notifications` !
  notifications: notificationsReducer()
  // your reducers here
}), {});

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
