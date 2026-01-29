import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk, createMessageThunk } from "../store/messages";
import { fetchChatboardThunk } from "../store/chatboard";
import EditDelete from "../components/EditDeleteMessage";
import "./Messages.css";

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

  // ✅ Track if user is currently typing/focused (prevents polling interference)
  const isTypingRef = useRef(false);

  // ---------- click outside to close edit/delete ----------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        outsideEditRef.current &&
        !outsideEditRef.current.contains(event.target)
      ) {
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

  // ---------- polling (but don't poll while typing) ----------
  useEffect(() => {
    const timer = setInterval(() => {
      // ✅ If input is focused/typing, skip refresh to avoid killing mobile keyboard
      if (isTypingRef.current) return;
      dispatch(fetchMessagesThunk());
    }, 2000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const enterRoom = (chatBoardId, name) => {
    setBoardId(chatBoardId);
    setRoomName(name);

    // When switching rooms, we DO want to land at the bottom once.
    forceScrollRef.current = true;

    // ✅ Avoid mobile keyboard weirdness: never force focus on small screens
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    if (!isSmallScreen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
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
      await dispatch(createMessageThunk(newMessage));
      setMessageInput("");

      // After YOU send a message, you probably want to see it.
      forceScrollRef.current = true;

      // ✅ Desktop only re-focus
      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
      if (!isSmallScreen) inputRef.current?.focus();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Smart auto-scroll
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
    <div className="page-body">
      {sessionUser ? (
        <div className="main-container">
          <div className="board-container">
            <h1>Welcome {sessionUser.username}</h1>
            <h2>All Message Boards</h2>

            {chatBoards.map((chatBoard) => (
              <div key={chatBoard.id}>
                <button onClick={() => enterRoom(chatBoard.id, chatBoard.name)}>
                  {chatBoard.name}
                </button>
              </div>
            ))}
          </div>

          <div className="message-container">
            <h2>{roomName} Message Board</h2>

            <div className="the-messages" ref={messagesWrapRef}>
              {boardMsgArr.map((message) => (
                <div key={message.id}>
                  {sessionUser.id === message.userId ? (
                    <div className="msg-edit">
                      <p className="schoolbell-regular">
                        {message.User?.username || "unknown"}: {message.content}
                      </p>

                      {showEditDeleteId === message.id && (
                        <div ref={outsideEditRef}>
                          <EditDelete
                            message={message}
                            onClose={() => setShowEditDeleteId(null)}
                          />
                        </div>
                      )}

                      <button onClick={() => setShowEditDeleteId(message.id)}>
                        Edit
                      </button>
                    </div>
                  ) : (
                    <p className="schoolbell-regular">
                      {message.User?.username || "Unknown User"}:{" "}
                      {message.content}
                    </p>
                  )}
                </div>
              ))}

              <div ref={bottomOfMsgs} />
            </div>

            <div className="input-field">
              <input
                type="text"
                value={messageInput}
                ref={inputRef}
                onFocus={() => {
                  isTypingRef.current = true;
                }}
                onBlur={() => {
                  isTypingRef.current = false;
                }}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={!boardId ? "Select a board first..." : "Type a message..."}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    putMsgTogether();
                  }
                }}
                autoComplete="off"
              />
              <button onClick={putMsgTogether}>
                Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-container">
          <div className="board-container">
            <h1>Please Log In or Sign Up to Post Messages</h1>
            <h2>All Message Boards</h2>

            <div className="boardrooms">
              {chatBoards.map((chatBoard) => (
                <div key={chatBoard.id}>
                  <button onClick={() => enterRoom(chatBoard.id, chatBoard.name)}>
                    {chatBoard.name}: {numOfmsgs(chatBoard.id)}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="message-container">
            <h2>{roomName} Message Board</h2>

            <div className="the-messages" ref={messagesWrapRef}>
              {boardMsgArr.map((message) => (
                <div key={message.id}>
                  <p className="schoolbell-regular">
                    {message.User?.username || "unknown"}: {message.content}
                  </p>
                </div>
              ))}
              <div ref={bottomOfMsgs} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
