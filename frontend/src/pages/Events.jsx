import { useDispatch, useSelector } from "react-redux";
import "./Events.css"
import { useEffect } from "react";
import { fetchEventsThunk } from "../store/events";

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events || {});
  const sessionUser = useSelector((state) => state.session.user || {});
  const eventsArr = Object.values(events);
  console.log("events:", eventsArr, events);

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  return (
    <>
        <h1 className="header">Events</h1>
    <div className="events-container">
        {eventsArr.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>Date: {event.eventDate}</p>
            {event.hostId === sessionUser.id && 
              <div>
                 <button>Edit</button>
              </div> 
            }
          </div>
        ))}

       
    </div>
    </>
  )
}
  export default Events;
