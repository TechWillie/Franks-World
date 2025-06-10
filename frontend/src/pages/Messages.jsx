import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk } from "../store/messages";
import "./Messages.css"
import { fetchChatboardThunk } from "../store/chatboard";

const Messages = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.messages);
  const chatBoards = useSelector((state) => state.chatBoard || []);
  
  useEffect(() => {
    dispatch(fetchMessagesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchChatboardThunk());
  }, [dispatch]);

  console.log("msg fron db:", messages);
  console.log("sessionUser:", sessionUser);
  console.log("chatBoards:", chatBoards);
  
  return (
    sessionUser ? (
      <div>
        <h1>Welcome {sessionUser.username}</h1>
        <h2>Your message Boards</h2>
      </div>
    ):(
      <div>
        <h1>Please Log In or Sign Up to View Messages</h1>
      </div>
    )
  );
};

export default Messages;