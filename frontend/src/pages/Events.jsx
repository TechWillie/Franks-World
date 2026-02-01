import { useDispatch, useSelector } from "react-redux";
import "./Events.css"
import { useEffect, useState } from "react";
import { fetchEventsThunk } from "../store/events";
import UpdateDelete from "../components/UpdateDelete";
import { fetchMediaThunk,  } from "../store/media";


const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events || {});
  const media = useSelector((state) => state.media || {})
  const sessionUser = useSelector((state) => state.session.user || {});
  const eventsArr = Object.values(events);
  const [isEvent, setIsEvent] = useState(null);
  const [selectEvent, setSelectEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchEventsThunk());
    dispatch(fetchMediaThunk())
    
  }, [dispatch]);
  
  console.log("🚨⚠️ Media object", Object.values(media));
  const mediaArr = Object.values(media)
  console.log("🔥🔥 Media Array", mediaArr[0]);
  
  
 const EventPage = ({ event }) => {
  const eventPics = mediaArr.filter(
    (m) => Number(m.eventId) === Number(event.id)
  );

  return (
    <div className="single-event-container">
      <h1>{event.name}</h1>

      {event.description ? (
        <p>{event.description}</p>
      ) : (
        <p>no description yet!..</p>
      )}

      {event.eventDate ? <span>{event.eventDate}</span> : <span>no date yet!..</span>}

      {eventPics.length === 0 ? (
        <p>No event pics yet.</p>
      ) : (
        eventPics.map((m) => (
          <img
            key={m.id || m.url}
            src={m.url}
            alt="Event"
            style={{
              width: "30%",
              maxWidth: "520px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "8px",
              marginTop: "10px",
              marginRight: "6px"
            }}
          />
        ))
      )}
    </div>
  );
};






  return (
    <div className="page-body">
      <div className="event-body">
      
          <div className="events-container">
  {eventsArr.map((event) => (
    <button
      key={event.id}
      className="event-card"
      onClick={() => setSelectEvent(event)}
      type="button"
    >
      <h2>{event.name}</h2>

      {mediaArr
        .filter((m) => m.eventId === event.id) 
        .map((m) => (
          <img
            key={m.id || m.url}
            src={m.url}
            alt="Event"
            style={{ width: "70%", height: "180px", objectFit: "cover" }}
          />
        ))}

      <p>{event.description}</p>
      <p>Date: {event.eventDate}</p>
      {event.hostId === sessionUser.id && (
        <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevents opening the event when clicking Edit
                      setIsEvent(event);}}>
                    Edit
                  </button>
                </div>
              )}
            </button>
          ))}
          {isEvent && <UpdateDelete event={isEvent} onClose={() => setIsEvent(null)} />}
        </div>

          
        <div className="single-container">
          {selectEvent && <EventPage event={selectEvent} />}
        </div>
      </div>
    </div>
  )
}
  export default Events;

