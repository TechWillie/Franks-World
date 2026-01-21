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

// ! Add profile pic
export const updateMyProfileImageThunk = (photo) => async (dispatch) => {
  console.log("New User Photo", photo);

  const res = await csrfFetch("/api/users/me/photo", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ photo }),
  });

  const data = await res.json();
  console.log("PUT /api/users/me/photo RESPONSE:", data);

  if (!res.ok) {
    console.error("❌ updateMyProfileImageThunk failed:", res.status, data);
    throw data;
  }

  // ✅ normalize payload shape: supports {user: {...}} or {...}
  const updatedUser = data.user ?? data;

  dispatch(setSessionUser(updatedUser));
  return updatedUser;
};



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
      state.user = action.payload?.user ?? action.payload;
      return state;
    case REMOVE_SESSION_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;