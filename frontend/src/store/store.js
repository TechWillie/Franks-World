import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
// Import your reducers here
import {thunk} from 'redux-thunk';
import logger from 'redux-logger'; // already good!
import sessionReducer from './session';
import usersReducer from './users';
import messagesReducer from './messages';
import chatBoardReducer from './chatboard';
import eventsReducer from './events';

// Dummy reducer
const dummyReducer = (state = { message: "Hello from Redux!" }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Root reducer
const rootReducer = combineReducers({
  dummy: dummyReducer,
  session: sessionReducer,
  users: usersReducer,
  messages: messagesReducer,
  chatboard: chatBoardReducer,
  events: eventsReducer,
});

// Middleware enhancer
let enhancer;

if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  enhancer = composeWithDevTools(
    applyMiddleware(thunk, logger)
  );
}

// Configure the store
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
