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
  // // console.log("events:", eventsArr, events);
  // console.log("⚠️⚠️media object", media);
  // console.log(Array.isArray(media));
  const mediaArray = Object.values(media)
  // console.log("👍👍 Media array :", mediaArray);
  
  useEffect(() => {
    dispatch(fetchEventsThunk());
    dispatch(fetchMediaThunk())
  }, [dispatch]);

  
  const EventPage = (eventObj) => {
    // console.log("the event obj for the box", Object.values(eventObj));
    const event = Object.values(eventObj)[0];
    // console.log("event", event);
    
    return(
      <div className="single-event-container">
        <h1>{event?.name}</h1> 
        {event.description 
        ? (<p>{event.description}</p>) 
        : <p>no description yet!..</p>}
        {event.eventDate
        ? (<p>{event.eventDate}</p>)
        : <p>no date yet!..</p>}
      </div>
    )
  }



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

      {mediaArray
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
          {selectEvent && <EventPage evenObj={selectEvent} />}
        </div>
      </div>
    </div>
  )
}
  export default Events;

