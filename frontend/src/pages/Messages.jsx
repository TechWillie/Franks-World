import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk, createMessageThunk, addMessage } from "../store/messages";
import { fetchChatboardThunk } from "../store/chatboard";
import EditDelete from "../components/EditDeleteMessage";
import "./Messages.css";
import { socket } from "../socket";
import { LuMessageSquareText } from "react-icons/lu";



const Messages = () => {
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user || null);
  const messagesObj = useSelector((state) => state.messages);
  const chatBoards = useSelector((state) => state.chatBoard);

  const [roomName, setRoomName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [boardId, setBoardId] = useState(0);
  const [showEditDeleteId, setShowEditDeleteId] = useState(null);

  const outsideEditRef = useRef(null);
  const bottomOfMsgs = useRef(null);
  const messagesWrapRef = useRef(null);
  const inputRef = useRef(null);

  // Tracks whether we should force-scroll (enter room / after sending)
  const forceScrollRef = useRef(false);

  // ---------- click outside to close edit/delete ----------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (outsideEditRef.current && !outsideEditRef.current.contains(event.target)) {
        setShowEditDeleteId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- initial load ----------
  useEffect(() => {
    dispatch(fetchChatboardThunk());
    dispatch(fetchMessagesThunk());
  }, [dispatch]);

  // ---------- join/leave socket room when board changes ----------
  useEffect(() => {
    if (!boardId) return;
    console.log("➡️ CLIENT joinRoom", boardId);
    socket.emit("joinRoom", { roomId: boardId });

    return () => {
      socket.emit("leaveRoom", { roomId: boardId });
    };
  }, [boardId]);

  // ---------- listen for live room messages ----------
  useEffect(() => {
    const handler = (payload) => {
      console.log("📥 CLIENT got roomMessage:", payload);
      
      
      // payload: { roomId, message }
      if (!payload?.roomId || !payload?.message) return;
      if (payload.roomId !== boardId) return;

      // 🔥 inject into redux so UI updates instantly
      dispatch(addMessage(payload.message));

      // scroll only if user is near bottom or we forced it
      // (optional: we already handle scroll in separate effect)
    };

    socket.on("roomMessage", handler);
    return () => socket.off("roomMessage", handler);
  }, [boardId, dispatch]);

  const enterRoom = (chatBoardId, name) => {
    setBoardId(chatBoardId);
    setRoomName(name);

    // When switching rooms, land at the bottom once.
    forceScrollRef.current = true;

    // Desktop focus only
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    if (!isSmallScreen) setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Memoize so it doesn't create a "new array" every render
  const boardMsgArr = useMemo(() => {
    return Object.values(messagesObj).filter((m) => m.chatRoomId === boardId);
  }, [messagesObj, boardId]);

  const numOfmsgs = (board) => {
    let count = 0;
    Object.values(messagesObj).forEach((msg) => {
      if (msg.chatRoomId === board) ++count;
    });
    return count;
  };

  // ---------- send message (REST first, then socket) ----------
  const putMsgTogether = async () => {
    if (!sessionUser) return;
    if (!boardId) return;
    if (!messageInput.trim()) return;

    const newMessage = {
      content: messageInput,
      userId: sessionUser.id,
      chatRoomId: boardId,
    };

    try {
      // IMPORTANT: your thunk MUST return created message (return data)
      const created = await dispatch(createMessageThunk(newMessage));
      console.log("🔥🔥⚠️⚠️created from thunk:", created);

      // If your thunk doesn't return, created will be undefined.
      // Fix thunk: after dispatch(addMessage(data)) -> return data;
      if (created) {
        socket.emit(
          "roomMessage",
          { roomId: boardId, message: created },
          (ack) => {
            console.log("✅ ACK from server:", ack);
          }
        );
        
        console.log("📤 emitted roomMessage", { roomId: boardId, messageId: created?.id });

      }

      setMessageInput("");

      // After sending, jump to bottom
      forceScrollRef.current = true;

      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
      if (!isSmallScreen) inputRef.current?.focus();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- smart auto-scroll ----------
  useEffect(() => {
    const wrap = messagesWrapRef.current;
    if (!wrap) return;

    const distanceFromBottom =
      wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight;

    const userIsNearBottom = distanceFromBottom < 120;

    if (forceScrollRef.current || userIsNearBottom) {
      bottomOfMsgs.current?.scrollIntoView({
        behavior: forceScrollRef.current ? "auto" : "smooth",
        block: "end",
      });
      forceScrollRef.current = false;
    }
  }, [boardMsgArr.length, boardId]);

  return (
    <div className="chatroom-body">
  {/* LEFT: rooms list */}
  <div className="board-container">
    {sessionUser ? <h1>Welcome {sessionUser.username}</h1> : <h1>Message Boards</h1>}
    <h2>All Chatrooms</h2>

    {chatBoards.map((chatBoard) => (
      <div key={chatBoard.id} className="board-row">
        <button
          className={boardId === chatBoard.id ? "active-room" : ""}
          onClick={() => enterRoom(chatBoard.id, chatBoard.name)}
        >
          {chatBoard.name}: {numOfmsgs(chatBoard.id)} <LuMessageSquareText />
        </button>
      </div>
    ))}
  </div>

  {/* RIGHT: messages */}
  <div className="main-container">
    <div className="message-container">
      <h2>{roomName ? `${roomName} Message Board` : "Select a chatroom"}</h2>

      <div className="the-messages" ref={messagesWrapRef}>
        {boardMsgArr.map((message) => {
          const isMine = sessionUser?.id === message.userId;
          const photo = message.User?.photo || "/default-avatar.png";

          return (
            <div key={message.id} className={`msg-row ${isMine ? "mine" : "theirs"}`}>
              <img
                src={photo}
                alt=""
                style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  objectFit: "cover", marginRight: "8px", verticalAlign: "middle", flexShrink: 0,
                }}
              />


              <div className="msg-content">
                <span className="schoolbell-regular msg-text">
                  <span className="msg-username">
                    {message.User?.username || "Unknown User"}:
                  </span>{" "}
                  {message.content}
                </span>

                {isMine && (
                  <div className="msg-actions" ref={outsideEditRef}>
                    {showEditDeleteId === message.id && (
                      <EditDelete
                        message={message}
                        onClose={() => setShowEditDeleteId(null)}
                      />
                    )}

                    <button
                      className="msg-edit-btn"
                      onClick={() => setShowEditDeleteId(message.id)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomOfMsgs} />
      </div>

      {/* input */}
      {sessionUser && (
        <div className="input-field">
          <input
            type="text"
            value={messageInput}
            ref={inputRef}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={!boardId ? "Select a board first..." : "Type a message..."}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                putMsgTogether();
              }
            }}
            autoComplete="off"
            disabled={!boardId}
          />
          <button onClick={putMsgTogether} disabled={!boardId}>
            Post
          </button>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default Messages;
