import { useState, useRef } from "react";
import { signup, updateMyProfileImageThunk } from "../store/session";
import { createMediaThunk } from "../store/media";
import "./SignupForm.css"
import { useDispatch } from "react-redux";
import UploadFile from "../components/UploadFile";


const SignupFormModal = ({show, onClose}) => {
 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [profileUpload, setProfileUpload] = useState(null);
// profileUpload will be { url, path, contentType, size, originalName }

  

  const signupForm = useRef();
  
    if (!show) return null;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🧾 handleSubmit fired")
      setErrors([]);

      const newUser = {
        firstName,
        lastName,
        email,
        username,
        password,
        bio: bio || null,
      };
    
      if (password !== repeatPassword) {
        setErrors(["Passwords do not match"]);
        return;
      }
    
      try {
        const signupResult = await dispatch(signup(newUser));
      
        if (Array.isArray(signupResult)) {
          setErrors(signupResult);
          return;
        }
        if (signupResult?.errors) {
          setErrors(signupResult.errors);
          return;
        }
      
        console.log("✅ User is authenticated at this point", profileUpload);
        
        if (profileUpload?.url && profileUpload?.storagePath) {
          console.log("🚀 about to POST /api/media with:", profileUpload);
          const mediaRow = await dispatch(
            createMediaThunk({
              url: profileUpload.url,
              storagePath: profileUpload.storagePath,              // ✅ must be path
              folder: profileUpload.folder,
              contentType: profileUpload.contentType,
              sizeBytes: profileUpload.sizeBytes,              // ✅ must be size
              originalName: profileUpload.originalName,
              mediaType: (profileUpload.contentType || "").startsWith("video/")
                ? "video"
                : "image",
            })
          );

          console.log("✅ mediaRow returned:", mediaRow);
          await dispatch(updateMyProfileImageThunk(mediaRow.url));
          onClose();
          return mediaRow
        }
        
      } catch (err) {
        console.error("Signup failed:", err);
        setErrors(["Signup failed. Please try again."]);
      }
    };
    

   return (
    <>
        <div className="modal-background"
              onMouseDown={(e) => {
          // only close if they clicked the background itself
          if (e.target === e.currentTarget) onClose();
        }}>
          <div className="modal-content">
            <form onSubmit={handleSubmit} ref={signupForm} onMouseDown={(e) => e.stopPropagation()}>
              <h2>Sign Up</h2>
              <ul>
                {Array.isArray(errors) && errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
              <label>
                <input type="text" value={firstName} placeholder=" First Name"
                onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label>
                <input type="text" value={lastName} placeholder=" Last Name"
                onChange={(e) => setLastName(e.target.value)} required />
              </label>
              <label>
                <input type="text" value={email} placeholder=" Email"
                onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                <input type="text" value={username} placeholder=" Username"
                onChange={(e) => setUsername(e.target.value)} required />
              </label>
              <UploadFile
                folder={`signups/${email || "new-user"}`}
                accept="image/*"
                maxMB={10}
                onUploaded={(payload) => {
                  console.log("✅ parent received upload payload:", payload);
                  setProfileUpload(payload)
                }}
              />

              <label>
                <textarea value={bio} placeholder=" Bio (optional)"
                onChange={(e) => setBio(e.target.value)} />
              </label>
              <label>
                <input type="password" value={password} placeholder=" Password"
                onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label>
                <input type="password" value={repeatPassword} placeholder=" Confirm Password"
                onChange={(e) => setRepeatPassword(e.target.value)} required />
              </label>
              <div className="modal-actions">
                <button type="button"
                onClick={handleSubmit}
                >Sign Up</button>
                <button type="button" onClick={() => onClose()}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      
    </>
  );
};
export default SignupFormModal;