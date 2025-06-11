import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk } from "../store/messages";
import "./Messages.css"
import { fetchChatboardThunk } from "../store/chatboard";

const Messages = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user || {});
  const messages = useSelector((state) => state.messages || {});
  const chatBoards = useSelector((state) => state.chatBoard || {});
  const [roomMSGs, setRoomMSGs] = useState([]);
  
  useEffect(() => {
    dispatch(fetchMessagesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchChatboardThunk());
  }, [dispatch]);

  const enterRoom = chatBoardId => {
    const userMsgArr = Object.values(messages).filter(message => message.chatRoomId === chatBoardId);
    console.log("clicked", userMsgArr);
    if(userMsgArr.length > 0){
      setRoomMSGs([])
      userMsgArr.forEach(message => {
          console.log("message:", message);
          setRoomMSGs(prev => [...prev, message]);
        })
    }else console.log("no messages");
  }

  console.log("msg fron db:", messages);
  console.log("sessionUser:", sessionUser);
  const ids = chatBoards.map((chatBoard) => chatBoard.id);
  console.log("ids:", ids);
  
  return (
    sessionUser ? (
      <div>
        <h1>Welcome {sessionUser.username}</h1>
        <h2>Your message Boards</h2>
        {chatBoards.map((chatBoard) => (
          <div key={chatBoard.id}>
            <button onClick={() => enterRoom(chatBoard.id)} >{chatBoard.name}</button>
          </div>
        ))}
        <h2>Your Messages</h2>
        {roomMSGs.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
          </div>
        ))}
        {/* {Object.values(messages).map((message) => (
          <div key={message.id}>
            <h3>{message.title}</h3>
            <p>{message.content}</p>
          </div>
        ))} */}
        {/* <h2>All Message Boards</h2>
        {chatBoards.map((chatBoard) => (
          <div key={chatBoard.id}>
            <h3>{chatBoard.name}</h3>
            <p>{chatBoard.description}</p>
          </div>
        ))} */}
      </div>
    ):(
      <div>
        <h1>Please Log In or Sign Up to Post Messages</h1>
        <h2>All Message Boards</h2>
        {chatBoards.map((chatBoard) => (
          <div key={chatBoard.id}>
            <h3>{chatBoard.name}</h3>
            <p>{chatBoard.description}</p>
          </div>
          ))}
      </div>
    )
  );
};

export default Messages;