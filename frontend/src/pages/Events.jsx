import { useDispatch, useSelector } from "react-redux";
import "./Events.css"
import { useEffect } from "react";
import { fetchEventsThunk } from "../store/events";

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events || {});
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
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Organizer: {event.organizer}</p>
          </div>
        ))}

       
    </div>
    </>
  )
}
  export default Events;
