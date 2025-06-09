import { useDispatch, useSelector } from "react-redux";
import "./Events.css"
import { useEffect, useState } from "react";
import { fetchEventsThunk } from "../store/events";
import UpdateDelete from "../components/UpdateDelete";

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events || {});
  const sessionUser = useSelector((state) => state.session.user || {});
  const eventsArr = Object.values(events);
  const [isEvent, setIsEvent] = useState(null);
  console.log("events:", eventsArr, events);

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  return (
    <>
        <h1 className="header">Events</h1>
    <div className="events-container">
      {console.log("event IDs:", eventsArr.map(e => e.id))}
        {eventsArr.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>Date: {event.eventDate}</p>
            {event.hostId === sessionUser.id && 
              <div>
                <button onClick={() => setIsEvent(event)}>Edit</button>
                
              </div> 
            }
          </div>
        ))}
          {isEvent && 
          <UpdateDelete event={isEvent} onClose={() => setIsEvent(null)} />}
       
    </div>
    </>
  )
}
  export default Events;
