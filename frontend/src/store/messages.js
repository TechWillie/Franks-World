const SET_MESSAGE = 'messages/SET_MESSAGE';
const REMOVE_MESSAGE = 'messages/REMOVE_MESSAGE';
const UPDATE_MESSAGE = 'messages/UPDATE_MESSAGE';
const ADD_MESSAGE = "messages/ADD_MESSAGE";
import { csrfFetch } from './csrf';

//! Action creators

const setMessages = (message) => ({
  type: SET_MESSAGE,
  payload: message
});
const removeMessage = (message) => ({
  type: REMOVE_MESSAGE,
  payload: message
});
const updateMessage = (message) => ({
  type: UPDATE_MESSAGE,
  payload: message
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message
});
//! Thunk action creators
export const createMessageThunk = (message) => async (dispatch) => {
  
  const response = await csrfFetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
    credentials: "include"
  }
  );
  if (response.ok) {
    const data = await response.json();
     dispatch(addMessage(data));
     return data;
  }
};

export const updateMessageThunk = (message) => async (dispatch) => {

  const response = await csrfFetch(`/api/messages/${message.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
    credentials: "include"
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(updateMessage(data));
  }
  };

  export const deleteMessageThunk = (message) => async (dispatch) => {
    const response = await csrfFetch(`/api/messages/${message.id}`, {
      method: 'DELETE',
      credentials: "include"
    });
    if (response.ok) {
      // console.log("Deleted message Id:", message.id);
      
      dispatch(removeMessage(message.id));
    }
  };

  export const fetchMessagesThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/messages');
    if (response.ok) {
      const messages = await response.json();
      messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      dispatch(setMessages(messages));
    }
  };

  const messageReducer = (state = {}, action) => {
    switch (action.type) {
      case SET_MESSAGE: {
        const newMessages = {};
        action.payload.forEach(msg => {
          newMessages[msg.id] = msg;
        });
        return { ...state, ...newMessages };
}
      case REMOVE_MESSAGE: {
        const newState = { ...state };
        delete newState[action.payload];
        return newState;
      }
      case ADD_MESSAGE: {
        return {...state, [action.payload.id]: action.payload}
      }
      case UPDATE_MESSAGE:
        
        return { ...state, [action.payload.id]: action.payload };
      default:
        return state;
    }
  };

  export default messageReducer;