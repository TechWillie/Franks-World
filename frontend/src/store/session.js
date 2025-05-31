import { csrfFetch } from './csrf';

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


// Thunk action creators
//! Login
export const login = (creds, pass) => async (dispatch) => {
  const response = await csrfFetch('/api/session/login', {
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


// ! Sign up
export const signup = (user) => async (dispatch) => {
    // const { firstName, lastName, username, email, password, bio = null } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(user)
  });

  if (response.ok) {
    const data = await response.json(); // { user: {...} }
    dispatch(setSessionUser(data.user));
    return data.user;
  }

  const errData = await response.json();
  throw errData;
};

// ! restore User
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session/restore');
  const data = await response.json();
  dispatch(setSessionUser(data.user));
  return data.user;
}
// ! logout
// store/session.js or wherever you manage session state
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
    credentials: 'include', // ensure cookies are included
  });

  if (response.ok) {
    dispatch(setSessionUser(null));
  }
};



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