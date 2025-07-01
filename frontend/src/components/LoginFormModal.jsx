import { useEffect, useState, useRef } from "react";
import "./LoginFormModal.css"
import { useDispatch } from "react-redux";
import { login } from "../store/session";


function LoginFormModal({show, onClose}) {
  
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        console.log('Clicked:', event.target);
        onClose(); // Close modal if click is outside the form
      }else {
    console.log("Clicked inside");
  }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show) return null;
  
  const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(login(username, password));
        if (data?.errors) {
            console.log(errors);
            setErrors(data.errors);
        }
        if (data) {
            console.log('User logged in', data);
            onClose();
        }
    };
  
  return (
    <div className="backdrop">
        <div>
            <form className="login-form" ref={modalRef} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <h2>Login Form</h2>
                <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                 />
                <button type="submit">Login</button>
            </form>
        </div>
        
    </div>
  )
}

export default LoginFormModal;