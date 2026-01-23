import { useState, useRef, useEffect } from "react";
import { signup, updateMyProfileImageThunk, restoreUser } from "../store/session";
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
  
  useEffect(() => {
      function handleClickOutside(event) {
           console.log('Clicked:', event.target);
        if (signupForm.current && !signupForm.current.contains(event.target)) {
          onClose(); // Close modal if click is outside the form
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!show) return null;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
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
      
        // ✅ User is authenticated at this point
        if (profileUpload?.url && profileUpload?.path) {
          const mediaRow = await dispatch(
            createMediaThunk({
              url: profileUpload.url,
              storagePath: profileUpload.path,            // ✅ rename
              folder: profileUpload.folder,
              contentType: profileUpload.contentType,
              sizeBytes: profileUpload.size,              // ✅ rename
              originalName: profileUpload.originalName,
              mediaType: (profileUpload.contentType || "").startsWith("video/")
                ? "video"
                : "image",                                // ✅ required
            })
            
          );
       
          // ✅ update user.photo
          await dispatch(updateMyProfileImageThunk(mediaRow.url));
        }
      
        onClose();
      } catch (err) {
        console.error("Signup failed:", err);
        setErrors(["Signup failed. Please try again."]);
      }
    };


   return (
    <>
        <div className="modal-background">
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
                folder={`temp-signups/${username || "new-user"}`}
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
              <button type="submit">Sign Up</button>
              <button type="button" onClick={() => onClose()}>Cancel</button>
            </form>
          </div>
        </div>
      
    </>
  );
};
export default SignupFormModal;