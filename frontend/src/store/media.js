import { csrfFetch } from "./csrf";

const SET_MEDIA = "media/SET_MEDIA";
const REMOVE_MEDIA = "media/REMOVE_MEDIA";
const UPDATE_MEDIA = "media/UPDATE_MEDIA";
const ADD_MEDIA = "media/ADD_MEDIA";

// Action Creators
const setMedia = (mediaArr) => ({
  type: SET_MEDIA,
  payload: mediaArr, // array from API
});

const removeMedia = (mediaId) => ({
  type: REMOVE_MEDIA,
  payload: mediaId,
});

const updateMedia = (media) => ({
  type: UPDATE_MEDIA,
  payload: media,
});

const addMedia = (media) => ({
  type: ADD_MEDIA,
  payload: media,
});

// Thunks

// media payload expected:
// { eventId?, url, path, folder?, contentType?, size?, originalName?, mediaType? }
export const createMediaThunk = (mediaPayload) => async (dispatch) => {
  console.log("🟦 createMediaThunk payload:", mediaPayload);
  try {
    const res = await csrfFetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mediaPayload),
      credentials: "include",
    });

    if (!res.ok) {
      let err;
      try { err = await res.json(); } catch { err = await res.text(); }
      console.error("❌ createMediaThunk failed:", res.status, err);
      throw err;
    }

    const data = await res.json();
    dispatch(addMedia(data));
    return data;
  } catch (error) {
    console.error("Error creating media:", error);
    throw error;
  }
};


export const updateMediaThunk = (mediaPayload) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/media/${mediaPayload.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mediaPayload),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(updateMedia(data));
      return data;
    }
  } catch (error) {
    console.error("Error updating media:", error);
  }
};

export const deleteMediaThunk = (mediaId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/media/${mediaId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      dispatch(removeMedia(mediaId));
      return true;
    }
  } catch (error) {
    console.error("Error deleting media:", error);
  }
};

// Fetch all media
export const fetchMediaThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/media");
    if (res.ok) {
      const data = await res.json(); // array
      dispatch(setMedia(data));
      return data;
    }
  } catch (error) {
    console.error("Error fetching media:", error);
  }
};

// Fetch media for an event (uses query param)
export const fetchMediaByEventIdThunk = (eventId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/media?eventId=${eventId}`);
    if (res.ok) {
      const data = await res.json(); // array
      dispatch(setMedia(data));
      return data;
    }
  } catch (error) {
    console.error("Error fetching media by eventId:", error);
  }
};

// Fetch media for current logged-in user (uses userId=me)
export const fetchMyMediaThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/media?userId=me`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json(); // array
      dispatch(setMedia(data));
      return data;
    }
  } catch (error) {
    console.error("Error fetching my media:", error);
  }
};

// Reducer helpers
const normalizeById = (arr) => {
  const obj = {};
  arr.forEach((item) => {
    obj[item.id] = item;
  });
  return obj;
};

const mediaReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_MEDIA: {
      // Replace state with normalized array
      return normalizeById(action.payload || []);
    }
    case REMOVE_MEDIA: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    case UPDATE_MEDIA: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case ADD_MEDIA: {
      return { ...state, [action.payload.id]: action.payload };
    }
    default:
      return state;
  }
};

export default mediaReducer;
