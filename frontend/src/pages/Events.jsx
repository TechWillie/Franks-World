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
  const [photosArr, setPhotosArr] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null);
  console.log("events:", eventsArr, events);

   useEffect(() => {
    const pics = () => {
      fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=3gylvIUXGfetqeCkeZK7Fy7fi3I3PYCdKyhl72fp")
      .then((response) => response.json())
      .then((data) => {
          console.log("DAta from api", data.photos);
          setPhotosArr(data.photos);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    pics();
   }, []);

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);
  console.log("Arrsy of photos", photosArr);
  
  const EventPage = (eventObj) => {
    console.log("the event obj for the box", Object.values(eventObj));
    const event = Object.values(eventObj)[0];
    console.log("event", event);
    
    return(
      <div className="single-event-container">
      <h1>{event?.name}</h1>
      {event.description 
      ? (<p>event.description</p>) 
      : <p>no description yet!..</p>}
      {event.eventDate
      ? (<p>event.eventDate</p>)
      : <p>no date yet!..</p>}
      </div>
    )
  }

  return (
    <div className="body">
      <h1 className="header">Events</h1>
      <div className="events-container">
        {/* {console.log("event IDs:", eventsArr.map(e => e.id))} */}
          {eventsArr.map((event) => (
            <button key={event.id} className="event-card" onClick={() => setSelectEvent(event)}>  
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <p>Date: {event.eventDate}</p>
              <img src={photosArr[event.id]?.img_src} alt="no pic" />
              {event.hostId === sessionUser.id && 
                <div>
                  <button onClick={() => setIsEvent(event)}>Edit</button>
                </div> 
              }
            </button>
          ))}
            {isEvent && 
            <UpdateDelete event={isEvent} onClose={() => setIsEvent(null)} />}
      </div>
      <div>
        {selectEvent && <EventPage evenObj={selectEvent} />}
      </div>
    </div>
  )
}
  export default Events;

