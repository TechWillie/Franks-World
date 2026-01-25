import { useEffect, useState, useRef } from "react";
import "./LoginFormModal.css";
import { useDispatch } from "react-redux";
import { login } from "../store/session";

function LoginFormModal({ show, onClose }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  // ✅ If modal isn't open, DO NOT mount listeners or UI
  useEffect(() => {
    if (!show) return;

    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // ✅ fixed
  }, [show, onClose]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const data = await dispatch(login(username, password));

    // if backend returns errors
    if (data?.errors) {
      setErrors(data.errors);
      return;
    }

    // ✅ if login thunk returns user or truthy success
    onClose();
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <form
        className="login-form"
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()} 
        onSubmit={handleSubmit}
      >
        <h2>Login Form</h2>

        {errors.length > 0 && (
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

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
  );
}

export default LoginFormModal;
