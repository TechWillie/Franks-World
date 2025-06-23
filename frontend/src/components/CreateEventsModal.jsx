import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEventThunk } from "../store/events";
import "./CreateEvents.css"
import { useNavigate } from "react-router-dom";

const CreateEventModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const sessionUser = useSelector((state) => state.session.user);
  const [eventObj, setEventObj] = useState({
    name: "",
    hostId: sessionUser?.id,
    description: "",
    eventDate: "",
    placeId: null,
    chatRoomId: null, 
  });
 const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  if (sessionUser?.id) {
    setEventObj((prev) => ({
      ...prev,
      hostId: sessionUser.id
    }));
  }
}, [sessionUser]);


 

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (submitted) return;
  setSubmitted(true); // prevent multiple submits

  const data = await dispatch(createEventThunk(eventObj));
  if (data?.errors) {
    // setErrors(data.errors);
    setSubmitted(false); // allow retry
  } else {
    setTimeout(() => onClose(), 0); // defer close to next tick
    // navigate(`/events/${data.id}`);
    navigate(`/events`);
  }
};

  return(
    <div className="backdrop">
        <div className="login-form" ref={modalRef}>
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
              <h4>Name of event</h4>
              <input type="text" value={eventObj.name} 
              onChange={(e) => setEventObj({ ...eventObj, name: e.target.value })} />
              <h4>Give us a brief description</h4>
              <input type="textarea" value={eventObj.description} 
              onChange={(e) => setEventObj({ ...eventObj, description: e.target.value })} />
              <h4>When is your event?</h4>
              <input type="date" value={eventObj.eventDate} 
              onChange={(e) => setEventObj({ ...eventObj, eventDate: e.target.value })} />
              <button type="submit">Create Event</button>
            </form>
        </div>
    
    </div>
  )
}
export default CreateEventModal;