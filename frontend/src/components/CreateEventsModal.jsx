import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createEventThunk } from "../store/events";
import UploadFile from "./UploadFile";
import "./CreateEvents.css";

const CreateEventModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const sessionUser = useSelector((state) => state.session.user);

  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");

  const [eventObj, setEventObj] = useState({
    name: "",
    hostId: sessionUser?.id || null,
    description: "",
    eventDate: "",
    placeId: null,
    chatRoomId: null,
  });

  useEffect(() => {
    if (sessionUser?.id) {
      setEventObj((previousEvent) => ({
        ...previousEvent,
        hostId: sessionUser.id,
      }));
    }
  }, [sessionUser?.id]);

  const getCsrfToken = async () => {
    const response = await fetch("/api/csrf/restore", {
      method: "GET",
      credentials: "include",
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          data?.message ||
          "Could not restore the security token."
      );
    }

    const csrfToken =
      data?.["XSRF-Token"] ||
      data?.csrfToken ||
      null;

    if (!csrfToken) {
      throw new Error(
        "The server did not return a security token."
      );
    }

    return csrfToken;
  };

  const uploadEventImage = async (file, eventId) => {
    if (!file) return null;

    if (!eventId) {
      throw new Error(
        "The event must be created before uploading its image."
      );
    }

    const csrfToken = await getCsrfToken();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("eventId", String(eventId));

    const response = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "include",
      headers: {
        "XSRF-TOKEN": csrfToken,
      },
      body: formData,
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          data?.message ||
          `Image upload failed with status ${response.status}.`
      );
    }

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitted || uploading) return;

    setFormError("");

    if (!sessionUser?.id) {
      setFormError(
        "You must be logged in to create an event."
      );
      return;
    }

    const trimmedName = eventObj.name.trim();
    const trimmedDescription =
      eventObj.description.trim();

    if (!trimmedName) {
      setFormError("Please enter an event name.");
      return;
    }

    if (!eventObj.eventDate) {
      setFormError("Please select an event date.");
      return;
    }

    setSubmitted(true);

    let createdEvent = null;

    try {
      const eventResponse = await dispatch(
        createEventThunk({
          ...eventObj,
          name: trimmedName,
          description: trimmedDescription,
          hostId: sessionUser.id,
        })
      );

      if (eventResponse?.errors) {
        const errorMessage = Array.isArray(
          eventResponse.errors
        )
          ? eventResponse.errors.join(", ")
          : String(eventResponse.errors);

        throw new Error(errorMessage);
      }

      createdEvent =
        eventResponse?.event ??
        eventResponse?.payload ??
        eventResponse;

      if (!createdEvent?.id) {
        throw new Error(
          "The event was not created because the server did not return an event ID."
        );
      }

      if (selectedFile) {
        setUploading(true);

        await uploadEventImage(
          selectedFile,
          createdEvent.id
        );
      }

      onClose();
      navigate("/events");
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);

      let errorMessage =
        error instanceof Error
          ? error.message
          : "The event could not be created.";

      if (createdEvent?.id && selectedFile) {
        errorMessage =
          `The event was created, but its image could not be uploaded. ` +
          errorMessage;
      }

      setFormError(errorMessage);
    } finally {
      setUploading(false);
      setSubmitted(false);
    }
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="login-form"
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Create Event</h2>

        <form onSubmit={handleSubmit}>
          <h4>Name of event</h4>

          <input
            type="text"
            value={eventObj.name}
            onChange={(event) =>
              setEventObj((previousEvent) => ({
                ...previousEvent,
                name: event.target.value,
              }))
            }
            required
          />

          <h4>Give us a brief description</h4>

          <textarea
            value={eventObj.description}
            onChange={(event) =>
              setEventObj((previousEvent) => ({
                ...previousEvent,
                description: event.target.value,
              }))
            }
          />

          <h4>Event image (optional)</h4>

          <UploadFile
            accept="image/*"
            maxMB={10}
            onPickFile={(file) => {
              setSelectedFile(file);
              setFormError("");
            }}
            onError={(error) => {
              console.error(
                "EVENT IMAGE PICK ERROR:",
                error
              );

              setSelectedFile(null);

              setFormError(
                error?.message ||
                  "The selected image could not be used."
              );
            }}
          />

          <h4>When is your event?</h4>

          <input
            type="date"
            value={eventObj.eventDate}
            onChange={(event) =>
              setEventObj((previousEvent) => ({
                ...previousEvent,
                eventDate: event.target.value,
              }))
            }
            required
          />

          {formError ? (
            <div
              style={{
                color: "crimson",
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              {formError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitted || uploading}
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