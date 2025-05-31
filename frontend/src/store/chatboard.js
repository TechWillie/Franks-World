import { csrfFetch } from './csrf';

const SET_CHATBOARD = 'chatboard/SET_CHATBOARD';
const ADD_CHATBOARD = 'chatboard/ADD_CHATBOARD';
const UPDATE_CHATBOARD = 'chatboard/UPDATE_CHATBOARD';
const REMOVE_CHATBOARD = 'chatboard/REMOVE_CHATBOARD';

//! Action creators
export const setChatboard = (chatboard) => ({
  type: SET_CHATBOARD,
  payload: chatboard
});
export const addChatboard = (chatboard) => ({
  type: ADD_CHATBOARD,
  payload: chatboard
});
export const updateChatboard = (chatboard) => ({
  type: UPDATE_CHATBOARD,
  payload: chatboard
});
export const removeChatboard = (chatboardId) => ({
  type: REMOVE_CHATBOARD,
  payload: chatboardId
});
//! Thunk action creators
export const fetchChatboardThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/chatrooms');
  if (response.ok) {
    const chatboards = await response.json();
    chatboards.forEach(board => {

      console.log("chatboards foreach:", board.createdAt);
    })
    
    dispatch(setChatboard(chatboards));
    }};
export const createChatboardThunk = (chatboard) => async (dispatch) => {
    const response = await csrfFetch('/api/chatrooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatboard),
    credentials: "include"
    }
    );
    if (response.ok) {
    const data = await response.json();
    dispatch(addChatboard(data));
    }
};
export const updateChatboardThunk = (chatboard) => async (dispatch) => {
    const response = await csrfFetch(`/api/chatrooms/${chatboard.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatboard),
    credentials: "include"
    }
    );
    if (response.ok) {
    const data = await response.json();
    dispatch(updateChatboard(data));
    }}

    export const deleteChatboardThunk = (chatboardId) => async (dispatch) => {
    const response = await csrfFetch(`/api/chatrooms/${chatboardId}`, {
    method: 'DELETE',
    credentials: "include"
    }
    );
    if (response.ok) {
    dispatch(removeChatboard(chatboardId));
    }
};

const chatBoardReducer = (state = [], action) => {
    switch (action.type) {
    case SET_CHATBOARD:
    return [...action.payload];
    case ADD_CHATBOARD:
    return { ...state, [action.payload.id]: action.payload };
    case UPDATE_CHATBOARD:
    return { ...state, [action.payload.id]: action.payload };
    case REMOVE_CHATBOARD:{
    const newState = { ...state };
    delete newState[action.payload];
    return newState;
    }
    default:
    return state;
    }
};
export default chatBoardReducer;