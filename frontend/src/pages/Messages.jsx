import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk, createMessageThunk } from "../store/messages";
import "./Messages.css"
import { fetchChatboardThunk } from "../store/chatboard";
import EditDelete from "../components/EditDeleteMessage";


const Messages = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user || null);
  const messages = useSelector((state) => state.messages);
  const chatBoards = useSelector((state) => state.chatBoard);
  const [roomName, setRoomName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [boardId, setBoardId] = useState(0);
  const [showEditDeleteId, setShowEditDeleteId] = useState(null);
  const outsideEditRef = useRef(null);
  
     useEffect(() => {
      const handleClickOutside = (event) => {
        if (outsideEditRef.current && !outsideEditRef.current.contains(event.target)) {
          setShowEditDeleteId(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },[]);
  
  
  useEffect(() => {
    dispatch(fetchChatboardThunk());
    dispatch(fetchMessagesThunk());

    const timer = setInterval(() => {
      dispatch(fetchMessagesThunk());
    }, 2000);
    return () => clearInterval(timer);
  }, [dispatch]);

  // useEffect(() => {
  // }, [dispatch]);

  const enterRoom = (chatBoardId, roomName) => {
    setBoardId(chatBoardId);
    setRoomName(roomName);
    console.log("*****chatBoardId:", chatBoardId);
  }

  const boardMsgArr = Object.values(messages).filter(message => message.chatRoomId === boardId);
    console.log("clicked", boardMsgArr);
   
  const putMsgTogether = () => {
    const newMessage = {
      content: messageInput,
      userId: sessionUser.id,
      chatRoomId: boardId,
    };

    try {
      dispatch(createMessageThunk(newMessage));
    }  
    catch (err) {
      console.log(err);
    }

    setMessageInput("");
};

// const editDelete = (message) => {
//   console.log("message from msg.jsx:", message);
//   return (
//     <>
//     <EditDelete message={message} onClose={() => {}} />
//     </>
//   );
// };

 

  console.log("msg fron db:", messages);
  console.log("sessionUser:", sessionUser);
  const ids = chatBoards.map((chatBoard) => chatBoard.id);
  console.log("ids:", ids);
  
return (
  <div>
  {sessionUser ? (
      <div className="main-container">
        <div className="board-container">
          <h1>Welcome {sessionUser.username}</h1>
          <h2>All Message Boards</h2>
          {chatBoards.map((chatBoard) => (
            <div key={chatBoard.id}>
              
              <button onClick={() => enterRoom(chatBoard.id, chatBoard.name)}>{chatBoard.name}</button>
            </div>
          ))}
        </div>

        <div className="message-container">
          <h2>{roomName} Message Board</h2>
          {boardMsgArr.map((message) => (
            <div key={message.id}>
              {sessionUser.id === message.userId ? (
                <div className="msg-edit">
                  <p className="schoolbell-regular">{message.User.username}:e {message.content}</p>
                    {showEditDeleteId === message.id && (
                      <div ref={outsideEditRef}>
                        <EditDelete message={message} onClose={() => {setShowEditDeleteId(null); 
                        }} />
                      </div>
                    )}
                    <button onClick={() => {setShowEditDeleteId(message.id)}}>Edit</button>

                  
                </div>
              ) : (
                <p>{message.User.username}: {message.content}</p>
              )}
            </div>
          ))}
          <input type="text" value={messageInput} 
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();  
              putMsgTogether();    
            }
          }} />
          <button onClick={() => putMsgTogether(messageInput, boardId)}>Post</button>
        </div>
      </div>
    ) : (
      <div className="main-container">
        <div className="board-container">
          <h1>Please Log In or Sign Up to Post Messages</h1>
          <h2>All Message Boards</h2>
          {chatBoards.map((chatBoard) => (
              <div key={chatBoard.id}>
                <button onClick={() => enterRoom(chatBoard.id, chatBoard.name)}>
                  {chatBoard.name}
                </button>
              </div>
            ))}
            <div className="message-container">
            <h2>{roomName} Message Board</h2>
            {boardMsgArr.map((message) => (
              <div key={message.id}>
                <p>{message.content}</p>
              </div>
            ))}
            </div>
        </div>
      </div>
    )}
  </div>
);

};

export default Messages;