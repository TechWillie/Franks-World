import { useState } from "react";
import "../pages/Home.css";
import UpdateDelete from "./UpdateDelete";

const UserEvents = ({ eventsArr, sessionUser }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const userEvents = eventsArr.filter(
    event => event.hostId === sessionUser?.id
  );

  if (!userEvents.length) return null;

  return (
    <div className="user-events-container">
      {userEvents.map(event => (
        <div key={event.id} className="user-event-card">
          <h3>{event.name}</h3>
          <p>{event.description}</p>
          <p>{event.eventDate}</p>

          {/* Open modal */}
          <button onClick={() => setSelectedEvent(event)}>
            Edit / Delete
          </button>
        </div>
      ))}

      {/* Modal */}
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
