import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk } from "../store/messages";
import "./Messages.css"

const Messages = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.messages);
  
  useEffect(() => {
    dispatch(fetchMessagesThunk());
  }, [dispatch]);
  console.log("msg fron db:", messages);
  


  return (
    <div>
      <h1>What&apos;s good... <br />What&apos;s Goin on..?</h1>
      {Object.values(messages).map((message) => (
        <div key={message.id} className="message-container">
          <p>{message.content}</p>
          <p>{message.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;