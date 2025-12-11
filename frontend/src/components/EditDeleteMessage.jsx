import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMessageThunk, deleteMessageThunk } from "../store/messages";
import "./EditDeleteMessage.css"

const EditDelete = ({ message, onClose }) => {
  console.log("message from EDitDelete:", message.content, message);
  const dispatch = useDispatch();
  const [messageContent, setMessageContent] = useState(message.content);
  const modalRef = useRef();
  const inputRef = useRef();  // Focus on the input field when the modal opens  
   
  useEffect(() => {    if (inputRef.current) {      
    inputRef.current.focus();
      }  }, []);
 


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  
  
  const editContent = () => {
    const updatedMessage = {
      ...message,
      content: messageContent,
    };
    dispatch(updateMessageThunk(updatedMessage));
    onClose();
  }

  const deleteMessage = () => {
    dispatch(deleteMessageThunk(message));
    onClose();
  }
  
 
  return (
    <div  ref={modalRef} className="msg-backdrop">
      <div>
        <input className="logibn-form-input" type="text"
        ref={inputRef}
        value={messageContent} 
        onChange={(e) => setMessageContent(e.target.value)} />
        <button onClick={editContent} >Update</button>
        <button onClick={deleteMessage}>Delete</button>
      </div>
    </div>
  )
}
  export default EditDelete;