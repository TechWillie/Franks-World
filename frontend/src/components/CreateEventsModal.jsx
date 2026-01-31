import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEventThunk } from "../store/events";
import { createMediaThunk } from "../store/media";
import "./CreateEvents.css";
import { useNavigate } from "react-router-dom";
import UploadFile from "./UploadFile";

const CreateEventModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const sessionUser = useSelector((state) => state.session.user);

  const [submitted, setSubmitted] = useState(false);

  // UploadFile payload after Upload finishes
  const [eventPic, setEventPic] = useState(null);

  // submit gating (no UploadFile changes needed)
  const [fileChosen, setFileChosen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [eventObj, setEventObj] = useState({
    name: "",
    hostId: sessionUser?.id,
    description: "",
    eventDate: "",
    placeId: null,
    chatRoomId: null,
  });

  // console.log("🧩 CreateEventModal RENDERED - version A");

  useEffect(() => {
    if (sessionUser?.id) {
      setEventObj((prev) => ({ ...prev, hostId: sessionUser.id }));
    }
  }, [sessionUser?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("🟦 SUBMIT fired");
    // console.log("🟦 eventPic at submit:", eventPic);
    // console.log
    (
      "🟦 SUBMIT has url?",
      !!eventPic?.url,
      "has storagePath?",
      !!eventPic?.storagePath,
      "fileChosen?",
      fileChosen,
      "uploading?",
      uploading
    );

    // If a file was chosen, force upload completion before submit
    if (fileChosen && (uploading || !eventPic?.url || !eventPic?.storagePath)) {
      console.warn("⚠️ Finish uploading the event image before submitting.");
      return;
    }

    if (submitted) return;
    setSubmitted(true);

    // ✅ Create event
    const res = await dispatch(createEventThunk(eventObj));
    // console.log("🟩 createEventThunk returned:", res);

    if (res?.errors) {
      console.error("❌ createEventThunk errors:", res.errors);
      setSubmitted(false);
      return;
    }

    // ✅ Normalize possible thunk return shapes
    const createdEvent =
      res?.event ??
      res?.payload ??
      res; // fallback if thunk returns the event directly

    if (!createdEvent?.id) {
      console.error("❌ No createdEvent.id found. Returned value was:", res);
      setSubmitted(false);
      return;
    }

    // ✅ Create media row if uploaded
    if (eventPic?.url && eventPic?.storagePath) {
      const mediaPayload = {
        url: eventPic.url,
        storagePath: eventPic.storagePath,
        folder: `events/${sessionUser?.id || "guest"}`,
        contentType: eventPic.contentType,
        sizeBytes: eventPic.sizeBytes,
        originalName: eventPic.originalName,
        mediaType: (eventPic.contentType || "").startsWith("video/")
          ? "video"
          : "image",
        userId: sessionUser?.id,
        eventId: createdEvent.id,
      };

      try {
        // console.log("🟨 createMediaThunk payload:", mediaPayload);

        const createdMedia = await dispatch(createMediaThunk(mediaPayload));

        // console.log("🟩 createMediaThunk result:", createdMedia);

        if (createdMedia?.errors) {
          console.error(
            "❌ createMediaThunk returned errors:",
            createdMedia.errors
          );
        }
      } catch (err) {
        console.error("🔥 createMediaThunk threw an error:", err);

        if (err?.json) {
          try {
            const data = await err.json();
            console.error("🔥 parsed error json:", data);
          } catch (parseErr) {
            console.error("🔥 failed to parse error json:", parseErr);
          }
        }
      }
    } else {
      // console.log("ℹ️ No event image uploaded — creating event without media.");
    }

    onClose();
    navigate("/events");
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="login-form"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Event</h2>

        <form onSubmit={handleSubmit}>
          <h4>Name of event</h4>
          <input
            type="text"
            value={eventObj.name}
            onChange={(e) => setEventObj({ ...eventObj, name: e.target.value })}
          />

          <h4>Give us a brief description</h4>
          <textarea
            value={eventObj.description}
            onChange={(e) =>
              setEventObj({ ...eventObj, description: e.target.value })
            }
          />

          <h4>Event image (optional)</h4>

          {/* Detect file selection without changing UploadFile */}
          <div
            onChange={(e) => {
              if (e.target?.type === "file") {
                setFileChosen(true);
                setEventPic(null);
                setUploading(true); // assume they intend to upload
              }
            }}
          >
            <UploadFile
              folder={`events/${sessionUser?.id || "guest"}`}
              accept="image/*"
              maxMB={10}
              onUploaded={(payload) => {
                // console.log("✅ event upload payload:", payload);
                setEventPic(payload);
                setUploading(false);
              }}
            />
          </div>

          <h4>When is your event?</h4>
          <input
            type="date"
            value={eventObj.eventDate}
            onChange={(e) =>
              setEventObj({ ...eventObj, eventDate: e.target.value })
            }
          />

          <button
            type="submit"
            disabled={submitted || (fileChosen && (!eventPic || uploading))}
          >
            {uploading
              ? "Uploading..."
              : submitted
              ? "Creating..."
              : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
