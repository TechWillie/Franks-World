const SET_MEDIA = 'media/SET_MEDIA';
const REMOVE_MEDIA = 'media/REMOVE_MEDIA';
const UPDATE_MEDIA = 'media/UPDATE_MEDIA';
const ADD_MEDIA = "media/ADD_MEDIA";
import { csrfFetch } from './csrf'

// ! Action Creators
const setMedia = (media) => ({
  type: SET_MEDIA,
  payload: media
});

const removeMedia = (media) => ({
  type: REMOVE_MEDIA,
  payload: media
});

const updateMedia = (media) => ({
  type: UPDATE_MEDIA,
  payload: media
});

const addMedia = (media) => ({
  type: ADD_MEDIA,
  payload: media
});

// ! Thunk Action Creators
export const createMediaThunk = (media) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media),
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(addMedia(data));
    }
  } catch (error) {
    console.error('Error creating media:', error);
  }
  };
  export const updateMediaThunk = (media) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/media/${media.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media),
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(updateMedia(data));
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  export const deleteMediaThunk = (media) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/media/${media.id}`, {
        method: 'DELETE',
        credentials: "include"
      });
      if (response.ok) {
        dispatch(removeMedia(media.id));
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };
  export const fetchMediaThunk = () => async (dispatch) => {
    try {
      const response = await csrfFetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        dispatch(setMedia(data));
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };
  export const fetchMediaByEventIdThunk = (eventId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/media/event/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setMedia(data));
      }
    } catch (error) {
      console.error('Error fetching media by event ID:', error);
    }
  };
  export const fetchMediaByUserIdThunk = (userId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/media/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setMedia(data));
      }
    } catch (error) {
      console.error('Error fetching media by user id:', error);
    }
  };

  const mediaReducer = (state = {}, action) => {
    switch (action.type) {
      case SET_MEDIA:
        return { ...state, ...action.payload };
      case REMOVE_MEDIA:
       { const newState = { ...state };
        delete newState[action.payload];
        return newState;}
      case UPDATE_MEDIA:
        return { ...state, [action.payload.id]: action.payload };
      case ADD_MEDIA:
        return { ...state, [action.payload.id]: action.payload };
      default:
        return state;
    }
  };

  export default mediaReducer;