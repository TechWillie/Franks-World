import { useEffect, useState, useRef } from "react";
import "./LoginFormModal.css"
import { useDispatch } from "react-redux";
import { login } from "../store/session";


function LoginFormModal({onClose}) {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    

  useEffect(() => {
    function handleClickOutside(event) {
         console.log('Clicked:', event.target);
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal if click is outside the form
      }
    }

    const userInfo = {
        username: 'demo',
        password: 'password'
      };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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
        <div ref={modalRef} >
            <form className="login-form" onSubmit={handleSubmit}>
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