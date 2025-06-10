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
    <div>
        {/* <div className="image">
        <h1 className="title">What&apos;s good... <br />What&apos;s Goin on..?</h1>
        {Object.values(messages).map((message) => (
        <div key={message.id} className="message-container">
          <h2>{message.content}</h2>
          <p>{message.createdAt}</p>
          <p>{message.userId}</p>
          {message.userId === sessionUser.id && (
            <button>Delete</button>
          )}
        </div> 
      ))}
        <div>
          <input type="text" placeholder="Let 'em know..." />
        </div>
        </div> */}
        {Object.values(chatBoards).map((chatBoard) => (
          <div key={chatBoard.id} className="message-container">
            {chatBoard.userId === sessionUser.id 
            ? ( 
            <>
            <h2>{chatBoard.content}</h2>
            <button>Edit</button>
            </> 
              )
            : (
              <>
                <h2>{chatBoard.content}</h2>
                <p>{chatBoard.createdAt}</p>
              </>
            )}
            
          </div>
        ))}
    </div>
  );
};

export default Messages;