import { useState, useRef, useEffect } from "react";
import { signup } from "../store/session";
import "./SignupForm.css"
import { useDispatch } from "react-redux";


const SignupFormModal = ({onClose}) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { 
        firstName, lastName, email, username, password, bio:bio || null
    };
    if (password === repeatPassword) {
      const data = await dispatch(signup(newUser));
      if (data) {
        setErrors(data);
      }
    } else {
      setErrors(["Passwords do not match"]);
    }
  };

   return (
    <>
        <div className="modal-background">
          <div className="modal-content" ref={signupForm}>
            <form onSubmit={handleSubmit}>
              <h2>Sign Up</h2>
              <ul>
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
              <label>
                First Name
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label>
                Last Name
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                Username
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </label>
              <label>
                Bio (optional)
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label>
                Repeat Password
                <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
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