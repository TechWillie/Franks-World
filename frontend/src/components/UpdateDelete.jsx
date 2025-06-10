import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateEventThunk, deleteEventThunk } from "../store/events";


const UpdateDelete = ({ event, onClose }) => {
//   const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const update = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
        function handleClickOutside(event) {
             console.log('Clicked:', event.target);
          if (update.current && !update.current.contains(event.target)) {
            onClose(); // Close modal if click is outside the form
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEventThunk(editedEvent));
    setEditedEvent({ ...event });
    onClose();
  };

  const deleteEvent = () => {
    dispatch(deleteEventThunk(event.id));
    onClose();
  };

  return (
    <div className="backdrop">
        <div ref={update} className="modal-content">
            <form onSubmit={handleSubmit}>
                <h2>Update delete</h2>
                <label>
                    Name:
                    <input
                    type="text"
                    value={editedEvent.name}
                    onChange={handleChange}
                    name="name"
                    />
                </label>
                <label>
                    Description:
                    <input
                    type="text"
                    value={editedEvent.description}
                    onChange={handleChange}
                    name="description"
                    />
                    </label>
                    <label>
                        Event Date:
                        <input
                        type="date"
                        value={editedEvent.eventDate}
                        onChange={handleChange}
                        name="eventDate"
                        />
                        </label>
                        <button type="submit">Update</button>
                        <button type="button" onClick={deleteEvent}>Delete</button>

                
            </form>

        </div>
    </div>
  )
}
  export default UpdateDelete;