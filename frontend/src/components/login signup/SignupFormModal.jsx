import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { signup, updateMyProfileImageThunk } from "../../store/session";
import { createMediaThunk } from "../../store/media";
import UploadFile from "../UploadFile";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import "./SignupForm.css";

const SignupFormModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // ✅ store the raw File (so we can upload after auth)
  const [profileFile, setProfileFile] = useState(null);

  const signupForm = useRef();
  if (!show) return null;

  // ✅ uploads to users/{uid}/... so your rules pass
  const uploadProfileToFirebase = async (file, uid) => {
  if (!uid) throw new Error("No Firebase UID available.");

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `users/${uid}/profile.${ext}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || undefined });
  const url = await getDownloadURL(storageRef);

  return {
    url,
    storagePath: path,
    folder: `users/${uid}`,
    contentType: file.type,
    sizeBytes: file.size,
    originalName: file.name,
  };
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setErrors([]);

    // ✅ client-side password check
    if (password !== repeatPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      username,
      password,
      bio: bio || null,
    };

    try {
      // 1) ✅ Create Firebase Auth user (needed for Storage rules)
      //    If already exists, just sign in
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (e) {
        if (e.code === "auth/email-already-in-use") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          throw e;
        }
      }

      // 2) ✅ Create backend user + session cookie
      await dispatch(signup(newUser)); // your thunk should throw JSON on errors

      // 3) ✅ Optional: upload profile image AFTER Firebase auth exists
      if (profileFile) {
        const uploaded = await uploadProfileToFirebase(profileFile, auth.currentUser.uid);

        // 4) Create media row in DB
        const mediaRow = await dispatch(
          createMediaThunk({
            url: uploaded.url,
            storagePath: uploaded.storagePath,
            folder: uploaded.folder,
            contentType: uploaded.contentType,
            sizeBytes: uploaded.sizeBytes,
            originalName: uploaded.originalName,
            mediaType: (uploaded.contentType || "").startsWith("video/")
              ? "video"
              : "image",
          })
        );

        // 5) update user profile image in DB
        await dispatch(updateMyProfileImageThunk(mediaRow.url));
      }

      // ✅ Success
      onClose();
    } catch (err) {
      console.error("Signup failed:", err);

      // ✅ show express-validator messages OR firebase messages
      const msgs =
        err?.errors ||
        [err?.message || "Signup failed. Please try again."];

      setErrors(msgs);
    }
  };

  return (
    <div
      className="modal-background"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <form
          onSubmit={handleSubmit}
          ref={signupForm}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2>Sign Up</h2>

          <ul>
            {Array.isArray(errors) &&
              errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>

          <label>
            <input
              type="text"
              value={firstName}
              placeholder=" First Name"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              type="text"
              value={lastName}
              placeholder=" Last Name"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              type="text"
              value={email}
              placeholder=" Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              />
              {errors && <small style={{ color: "crimson" }}>{errors}</small>}
          </label>

          <label>
            <input
              type="text"
              value={username}
              placeholder=" Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          {/* ✅ preview now, upload later */}
          <UploadFile
            accept="image/*"
            maxMB={10}
            onPickFile={(file) => setProfileFile(file)}
            onError={(e) => setErrors([e.message])}
          />

          <label>
            <textarea
              value={bio}
              placeholder=" Bio (optional)"
              onChange={(e) => setBio(e.target.value)}
            />
          </label>

          <label>
            <input
              type="password"
              value={password}
              placeholder=" Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              type="password"
              value={repeatPassword}
              placeholder=" Confirm Password"
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            {/* ✅ submit properly */}
            <button type="submit">Sign Up</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupFormModal;