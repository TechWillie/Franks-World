import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createChatboardThunk } from "../store/chatboard";

import { useNavigate } from "react-router-dom";

const CreateChatboardModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
//   const [errors, setErrors] = useState([]);
//   const [showErrors, setShowErrors] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

  const modalRef = useRef();
//   const sessionUser = useSelector((state) => state.session.user);

  const [chatboardObj, setChatboardObj] = useState({
    name: "",
    isPrivate: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (name) {
      const newChatt = {name, isPrivate: false};
      console.log("Form submitted", name);
      // setChatboardObj({ name });
      dispatch(createChatboardThunk(newChatt));
      navigate('/messages')
      onClose();
    } else {
      console.log("Name is required");
      
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
 
  return (
     <div className="backdrop">
        <form onSubmit={handleSubmit} className="login-form" ref={modalRef}>
        <h1>Create Mesage Board</h1>
            <label>
                Name
                <input
                type="text"
                placeholder=" Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </label>
            <button type="submit">Create</button>
        </form>
     </div>
  )
}  


export default CreateChatboardModal;