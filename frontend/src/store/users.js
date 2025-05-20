// Action Types
const SET_USERS = 'users/SET_USERS';
const ADD_USER = 'users/ADD_USER';
const UPDATE_USER = 'users/UPDATE_USER';
const SET_ACTIVE_USER = 'users/SET_ACTIVE_USER';

// Action Creators
export const setUsers = (users) => ({ type: SET_USERS, users });
export const addUser = (user) => ({ type: ADD_USER, user });
export const updateUser = (user) => ({ type: UPDATE_USER, user });
export const setActiveUser = (user) => ({ type: SET_ACTIVE_USER, user });

// Thunk Action Creators (example if using async API)
export const fetchUsers = () => async (dispatch) => {
  const res = await fetch('/api/users');
  if (res.ok) {
    const data = await res.json();
    dispatch(setUsers(data));
  }
};

export const fetchUserById = (id) => async (dispatch) => {
  const res = await fetch(`/api/users/${id}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(setActiveUser(data));
  }
};

export const createUser = (userData) => async (dispatch) => {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addUser(data));
  }
};

export const updateUserThunk = (userData) => async (dispatch) => {
  const res = await fetch(`/api/users/${userData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(updateUser(data));
  }
};

// Initial State
const initialState = {
  allUsers: [],
  activeUser: null,
};

// Reducer
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return { ...state, allUsers: action.users };
    case ADD_USER:
      return { ...state, allUsers: [...state.allUsers, action.user] };
    case UPDATE_USER:
      return {
        ...state,
        allUsers: state.allUsers.map(u => u.id === action.user.id ? action.user : u),
      };
    case SET_ACTIVE_USER:
      return { ...state, activeUser: action.user };
    default:
      return state;
  }
}
