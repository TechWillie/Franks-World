import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEventThunk } from "../store/events";
import "./CreateEvents.css";
import { useNavigate } from "react-router-dom";
import UploadFile from "./UploadFile";

const CreateEventModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const sessionUser = useSelector((state) => state.session.user);

  const [submitted, setSubmitted] = useState(false);

  // If you're uploading an event image, track it here
  const [eventUpload, setEventUpload] = useState(null);

  const [eventObj, setEventObj] = useState({
    name: "",
    hostId: sessionUser?.id,
    description: "",
    eventDate: "",
    placeId: null,
    chatRoomId: null,
    // optional: imageUrl: null,
  });

  useEffect(() => {
    if (sessionUser?.id) {
      setEventObj((prev) => ({ ...prev, hostId: sessionUser.id }));
    }
  }, [sessionUser?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitted) return;
    setSubmitted(true);

    // If you want to store the uploaded image URL on the event:
    // const payload = { ...eventObj, imageUrl: eventUpload?.url ?? null };

    const data = await dispatch(createEventThunk(eventObj));

    if (data?.errors) {
      setSubmitted(false);
      return;
    }

    // Close modal first (so UI updates immediately)
    onClose();

    // Then navigate
    navigate("/events");
  };

  return (
    <div
      className="backdrop"
      onMouseDown={onClose} // click backdrop closes
    >
      <div
        className="login-form"
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()} // clicking inside doesn't close
      >
        <h2>Create Event</h2>

        <form onSubmit={handleSubmit}>
          <h4>Name of event</h4>
          <input
            type="text"
            value={eventObj.name}
            onChange={(e) =>
              setEventObj({ ...eventObj, name: e.target.value })
            }
          />

          <h4>Give us a brief description</h4>
          <textarea
            value={eventObj.description}
            onChange={(e) =>
              setEventObj({ ...eventObj, description: e.target.value })
            }
          />

          <h4>Event image (optional)</h4>
          <UploadFile
            folder={`events/${sessionUser?.id || "guest"}`}
            accept="image/*"
            maxMB={10}
            onUploaded={(payload) => {
              console.log("✅ event upload payload:", payload);
              setEventUpload(payload);
              // if you store on eventObj:
              // setEventObj(prev => ({ ...prev, imageUrl: payload.url }));
            }}
          />

          <h4>When is your event?</h4>
          <input
            type="date"
            value={eventObj.eventDate}
            onChange={(e) =>
              setEventObj({ ...eventObj, eventDate: e.target.value })
            }
          />

          <button type="submit" disabled={submitted}>
            {submitted ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
