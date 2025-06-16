import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMessageThunk, deleteMessageThunk } from "../store/messages";
import "./EditDeleteMessage.css"

const EditDelete = ({ message, onClose }) => {
  console.log("message from EDitDelete:", message.content, message);
  const dispatch = useDispatch();
  const [messageContent, setMessageContent] = useState(message.content);
  
  const editContent = () => {
    const updatedMessage = {
      ...message,
      content: messageContent,
    };
    dispatch(updateMessageThunk(updatedMessage));
    onClose();
  }
  

  return (
    <div className="msg-backdrop">
    <input className="logibn-form-input" type="text" value={messageContent} 
    onChange={(e) => setMessageContent(e.target.value)} />
    <button onClick={editContent} >Update / Delete</button>
    </div>
  )
}
  export default EditDelete;