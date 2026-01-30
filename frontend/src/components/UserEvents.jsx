import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../pages/Home.css";
import UpdateDelete from "./UpdateDelete";
import { fetchMediaThunk } from "../store/media"; // <-- adjust path if needed

const UserEvents = ({ eventsArr = [], sessionUser }) => {
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ pull media from redux
  const mediaState = useSelector((state) => state.media);

  // ✅ normalize media into an array (works whether state.media is array or object map)
  const mediaArr = useMemo(() => {
    if (!mediaState) return [];
    if (Array.isArray(mediaState)) return mediaState;
    if (Array.isArray(mediaState?.media)) return mediaState.media; // if you store {media: []}
    return Object.values(mediaState); // if you store { [id]: mediaObj }
  }, [mediaState]);

  // ✅ load media once (or whenever user changes)
  useEffect(() => {
    dispatch(fetchMediaThunk());
  }, [dispatch]);

  const userEvents = useMemo(() => {
    return eventsArr.filter((event) => event.hostId === sessionUser?.id);
  }, [eventsArr, sessionUser?.id]);

  // helper: find best image for an event
  const getEventImageUrl = (eventId) => {
    const matches = mediaArr.filter((m) => m?.eventId === eventId);

    // prefer images over video
    const image = matches.find((m) => m?.mediaType === "image") || matches[0];

    return image?.url || null;
  };

  if (!userEvents.length) return null;

  return (
    <div className="user-events-container">
      {userEvents.map((event) => {
        const imgUrl = getEventImageUrl(event.id);

        return (
          <div key={event.id} className="user-event-card">
            <h3>{event.name}</h3>

            {/* ✅ show event picture if exists */}
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={`${event.name} cover`}
                className="user-event-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}

            <p>{event.description}</p>
            <p>{event.eventDate}</p>

            <button onClick={() => setSelectedEvent(event)}>
              Edit / Delete
            </button>
          </div>
        );
      })}

      {selectedEvent && (
        <UpdateDelete
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default UserEvents;

