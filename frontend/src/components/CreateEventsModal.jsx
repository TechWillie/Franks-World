import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { createEventThunk } from "../store/events";
import { createMediaThunk } from "../store/media";
import { storage } from "../firebase";
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

  const uploadEventImage = async (file) => {
    if (!file) return null;

    if (!sessionUser?.id) {
      throw new Error("You must be logged in to upload an event image.");
    }

    const safeFileName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const folder = `events/${sessionUser.id}`;
    const storagePath = `${folder}/${Date.now()}-${safeFileName}`;

    const imageReference = ref(storage, storagePath);

    const uploadSnapshot = await uploadBytes(
      imageReference,
      file,
      {
        contentType: file.type || "image/jpeg",
      }
    );

    const downloadUrl = await getDownloadURL(
      uploadSnapshot.ref
    );

    return {
      url: downloadUrl,
      storagePath: uploadSnapshot.ref.fullPath,
      folder,
      contentType: file.type || "image/jpeg",
      sizeBytes: file.size,
      originalName: file.name,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitted || uploading) return;

    setFormError("");

    if (!sessionUser?.id) {
      setFormError("You must be logged in to create an event.");
      return;
    }

    if (!eventObj.name.trim()) {
      setFormError("Please enter an event name.");
      return;
    }

    if (!eventObj.eventDate) {
      setFormError("Please select an event date.");
      return;
    }

    setSubmitted(true);

    try {
      const eventResponse = await dispatch(
        createEventThunk({
          ...eventObj,
          name: eventObj.name.trim(),
          description: eventObj.description.trim(),
          hostId: sessionUser.id,
        })
      );

      if (eventResponse?.errors) {
        const errorMessage = Array.isArray(eventResponse.errors)
          ? eventResponse.errors.join(", ")
          : String(eventResponse.errors);

        throw new Error(errorMessage);
      }

      const createdEvent =
        eventResponse?.event ??
        eventResponse?.payload ??
        eventResponse;

      if (!createdEvent?.id) {
        throw new Error(
          "The event was not created because no event ID was returned."
        );
      }

      if (selectedFile) {
        setUploading(true);

        const uploadedImage = await uploadEventImage(
          selectedFile
        );

        const mediaPayload = {
          url: uploadedImage.url,
          storagePath: uploadedImage.storagePath,
          folder: uploadedImage.folder,
          contentType: uploadedImage.contentType,
          sizeBytes: uploadedImage.sizeBytes,
          originalName: uploadedImage.originalName,
          mediaType: uploadedImage.contentType.startsWith(
            "video/"
          )
            ? "video"
            : "image",
          userId: sessionUser.id,
          eventId: createdEvent.id,
        };

        const mediaResponse = await dispatch(
          createMediaThunk(mediaPayload)
        );

        if (mediaResponse?.errors) {
          const mediaError = Array.isArray(
            mediaResponse.errors
          )
            ? mediaResponse.errors.join(", ")
            : String(mediaResponse.errors);

          throw new Error(
            `The event was created, but the image record failed: ${mediaError}`
          );
        }
      }

      onClose();
      navigate("/events");
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "The event could not be created."
      );
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
