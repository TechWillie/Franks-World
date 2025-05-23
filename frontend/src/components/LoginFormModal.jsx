import { useEffect, useRef } from "react";
import "./LoginFormModal.css"



function LoginFormModal({onClose}) {
    const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
         console.log('Clicked:', event.target);
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal if click is outside the form
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="backdrop">
        <div ref={modalRef} >
            <form className="login-form">
                <h2>Login Form</h2>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
        
    </div>
  )
}

export default LoginFormModal;