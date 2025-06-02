const ADD_EVENT = 'events/ADD_EVENT';
const REMOVE_EVENT = 'events/REMOVE_EVENT';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const SET_EVENTS = 'events/SET_EVENTS';
import { csrfFetch } from './csrf';

//! Action creators
const setEvents = (events) => ({
  type: SET_EVENTS,
  payload: events
});

const addEvent = (event) => ({
  type: ADD_EVENT,
  payload: event
});

const removeEvent = (eventId) => ({
  type: REMOVE_EVENT,
  payload: eventId
});

const updateEvent = (event) => ({
  type: UPDATE_EVENT,
  payload: event
});

//! Thunk action creators
export const fetchEventsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/events');
  if (response.ok) {
    const events = await response.json();
    dispatch(setEvents(events));
  }}
export const createEventThunk = (event) => async (dispatch) => {
    const response = await csrfFetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      credentials: "include"
    }
    );
    if (response.ok) {
      const data = await response.json();
      dispatch(addEvent(data));
    }
  };
export const updateEventThunk = (event) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      credentials: "include"
    }
    );
    if (response.ok) {
      const data = await response.json();
      dispatch(updateEvent(data));
    }}

export const deleteEventThunk = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
      method: 'DELETE',
      credentials: "include"
    })
    if (response.ok) {
      dispatch(removeEvent(eventId));
    }
  }

  const initialState = {};
  const eventReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_EVENTS:
        return { ...state, ...action.payload };
      case ADD_EVENT:
        return { ...state, [action.payload.id]: action.payload };
      case REMOVE_EVENT:{
        const newState = { ...state };
        delete newState[action.payload];
        return newState;}
      case UPDATE_EVENT:
        return { ...state, [action.payload.id]: action.payload };
      default:
        return state;
    }
  };
  
  export default eventReducer;