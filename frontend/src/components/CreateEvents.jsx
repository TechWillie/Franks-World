import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEventThunk } from "../store/events";

const CreateEventModal = ({ onClose }) => {
    const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [eventObj, setEventObj] = useState({
    name: "",
    description: "",
    hostId: sessionUser.id,
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(createEventThunk(eventObj));
    if (data?.errors) {
      setErrors(data.errors);
    }
    if (data) {
      console.log("Event created", data);
      onClose();
    }
  };

  return(
    <div>
        <h1>Create Event</h1>
    </div>
  )
}
export default CreateEventModal;