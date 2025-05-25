import { data } from "react-router-dom";
import { csrfFetch } from "./csrf";

// src/store/session.js
const SET_SESSION_USER = 'session/SET_SESSION_USER';
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';

// Action creators
export const setSessionUser = (user) => ({
  type: SET_SESSION_USER,
  payload: user
});

export const removeSessionUser = () => ({
  type: REMOVE_SESSION_USER
});

export const login = (creds, pass) => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credential: creds, password: pass })
});
const data = await response.json();
console.log("Response body", data);
  if (response.ok) {
    dispatch(setSessionUser(data.user));
  }
  return data;
}
// Reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_USER:
      return { ...state, user: action.payload };
    case REMOVE_SESSION_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;