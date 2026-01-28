import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Check,
  CheckCheck,
  Trash2,
  Bot,
  Phone,
  Video,
  MessageCircle,
} from "lucide-react";
import API from "../api/axios";
import { socket } from "../socket/socket";
import Logo from "../assets/logo";
import { useNavigate } from "react-router-dom";
import { playNotification } from "../utils/notification";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSidebar from "../components/ThemeSidebar";
import EmojiPicker from "../components/EmojiPicker";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const bottomRef = useRef(null);
  const contextMenuRef = useRef(null);
  const navigate = useNavigate();
  const { themeConfig } = useTheme();

  const AI_ASSISTANT = { _id: "ai", username: "AI Assistant", isAI: true };

  const token = localStorage.getItem("token");
  const loggedUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;

  /* auth */
  useEffect(() => {
    if (!loggedUserId) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [loggedUserId, navigate]);

  /* users */
  useEffect(() => {
    API.get("/users").then(res => {
      setUsers(res.data.filter(u => u._id !== loggedUserId));
    });
  }, [loggedUserId]);

  /* socket */
  useEffect(() => {
    if (!loggedUserId) return;

    socket.connect();
    socket.emit("join", loggedUserId);

    socket.on("onlineUsers", users => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", msg => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      if (msg.sender !== loggedUserId) {
        playNotification();
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [loggedUserId]);

  /* load chat */
  useEffect(() => {
    if (!selectedUser) return;

    if (selectedUser.isAI) {
      setMessages([]);
      return;
    }

    API.get(`/chat/${selectedUser._id}`).then(res => {
      setMessages(res.data);
    });
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* send message */
  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const messageText = text;
    setText("");

    const tempMessage = {
      _id: Date.now(),
      sender: loggedUserId,
      receiver: selectedUser._id,
      text: messageText,
      seen: false,
      time: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      if (selectedUser.isAI) {
        setIsLoadingAI(true);
        const res = await API.post("/ai/chat", { message: messageText });

        setMessages(prev => [
          ...prev,
          {
            _id: Date.now() + 1,
            sender: "ai",
            text: res.data.reply,
            seen: true,
            time: new Date().toISOString(),
        
        
          },
        ]);

        setIsLoadingAI(false);
        return;
      }

      const res = await API.post("/chat/send", {
        receiverId: selectedUser._id,
        text: messageText,
      });

      setMessages(prev =>
        prev.map(m => (m._id === tempMessage._id ? res.data : m))
      );

      socket.emit("sendMessage", res.data);
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      setText(messageText); // Restore the text
      setIsLoadingAI(false);
    }
  };

  const deleteChat = async () => {
    if (selectedUser?.isAI) {
      setMessages([]);
      return;
    }
    await API.delete(`/chat/delete/${selectedUser._id}`);
    setMessages([]);
  };

  const formatTime = (time) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEmojiSelect = (emoji) => {
    setText(prev => prev + emoji);
  };

  const handleMessageRightClick = (e, message) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      messageId: message._id,
      messageText: message.text,
      isSender: message.sender === loggedUserId,
    });
  };

  const handleCopyMessage = () => {
    if (contextMenu?.messageText) {
      navigator.clipboard.writeText(contextMenu.messageText);
      setContextMenu(null);
    }
  };

  const handleDeleteMessage = () => {
    if (contextMenu?.messageId) {
      setMessages(prev => prev.filter(m => m._id !== contextMenu.messageId));
      setContextMenu(null);
    }
  };

  const handleReplyMessage = () => {
    if (contextMenu?.messageText) {
      setReplyingTo({
        id: contextMenu.messageId,
        text: contextMenu.messageText,
      });
      setText("");
      setContextMenu(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu]);
  return (
    <div className={`h-screen flex ${themeConfig.bg}`}>
      {/* Theme/Settings Sidebar */}
      <ThemeSidebar />

      {/* sidebar */}
      <div className={`w-80 ${themeConfig.sidebar} border-r ${themeConfig.border} fixed md:static h-full z-50
        ${showSidebar ? "block" : "hidden"} md:flex flex-col`}>

        <div className={`p-4 border-b ${themeConfig.border}`}>
          <Logo />
        </div>

        {/* ai */}
        <div
          onClick={() => {
            setSelectedUser(AI_ASSISTANT);
            setShowSidebar(false);
          }}
          className={`flex items-center gap-3 px-4 py-3 ${themeConfig.hover} cursor-pointer`}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <p className={`font-semibold ${themeConfig.text}`}>AI Assistant</p>
            <p className="text-xs text-green-600">Always Online</p>
          </div>
        </div>

        {/* user */}
        <div className="flex-1 overflow-y-auto">
          {users.map(user => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setShowSidebar(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 ${themeConfig.hover} cursor-pointer`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gray-700 rounded-full text-white flex items-center justify-center">
                  {user.username[0]}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              <p className={`font-medium ${themeConfig.text}`}>{user.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* chat */}
      <div className="flex-1 flex flex-col">

        {/* header */}
        {selectedUser && (
          <div className={`p-4 ${themeConfig.header} border-b ${themeConfig.border} flex justify-between items-center`}>
            <div>
              <p className={`font-semibold ${themeConfig.text}`}>{selectedUser.username}</p>
              <p className={`text-xs ${themeConfig.textSecondary}`}>
                {selectedUser.isAI
                  ? "Online"
                  : onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeSwitcher />
              <Phone className={`${themeConfig.text} cursor-pointer`} />
              <Video className={`${themeConfig.text} cursor-pointer`} />
              <Trash2 onClick={deleteChat} className={`${themeConfig.text} cursor-pointer`} />
            </div>
          </div>
        )}

        {/* messages */}
        <div className="flex-1 p-6 overflow-y-auto">

          {!selectedUser && (
            <div className={`h-full flex flex-col items-center justify-center ${themeConfig.textSecondary}`}>
              <MessageCircle size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm mt-1">
                Select a user from the sidebar to begin chatting 
              </p>
            </div>
          )}

          {selectedUser && (
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg._id}
                  className={`max-w-sm px-4 py-2 rounded-2xl mb-3 group cursor-context-menu
                    ${msg.sender === loggedUserId
                      ? `ml-auto ${themeConfig.sentMessage}`
                      : themeConfig.receivedMessage}`}
                  onContextMenu={(e) => handleMessageRightClick(e, msg)}
                >
                  {replyingTo && replyingTo.id === msg._id && (
                    <div className={`text-xs mb-2 pb-2 border-b ${themeConfig.border} opacity-70`}>
                      → {replyingTo.text.substring(0, 50)}
                      {replyingTo.text.length > 50 ? "..." : ""}
                    </div>
                  )}
                  <p>{msg.text}</p>
                  <div className="flex justify-end gap-1 text-xs opacity-80">
                    <span>{formatTime(msg.time || msg.createdAt)}</span>
                    {msg.sender === loggedUserId &&
                      (msg.seen ? <CheckCheck size={14} /> : <Check size={14} />)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoadingAI && <p className={`text-xs ${themeConfig.textSecondary}`}>AI thinking…</p>}
          <div ref={bottomRef} />
        </div>

        {/* input */}
        {selectedUser && (
          <>
            {/* Context Menu */}
            {contextMenu && (
              <div
                ref={contextMenuRef}
                className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden"
                style={{
                  left: `${contextMenu.x}px`,
                  top: `${contextMenu.y}px`,
                  minWidth: "160px",
                }}
              >
                <button
                  onClick={handleCopyMessage}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                 Copy
                </button>
                <button
                  onClick={handleReplyMessage}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                 Reply
                </button>
                {contextMenu.isSender && (
                  <button
                    onClick={handleDeleteMessage}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                  >
                   Delete
                  </button>
                )}
              </div>
            )}

            {/* Reply Indicator */}
            {replyingTo && (
              <div className={`px-4 pt-3 flex items-center justify-between ${themeConfig.header} border-t ${themeConfig.border}`}>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Replying to:</p>
                  <p className={`text-sm ${themeConfig.textSecondary} truncate`}>{replyingTo.text}</p>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
                >
                  ×
                </button>
              </div>
            )}

            <div className={`p-4 ${themeConfig.header} border-t ${themeConfig.border} flex gap-2 items-center`}>
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                className={`flex-1 ${themeConfig.bgSecondary} ${themeConfig.text} rounded-full px-4 py-2 outline-none`}
                placeholder="Type a message"
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
