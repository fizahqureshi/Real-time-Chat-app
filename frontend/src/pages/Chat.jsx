import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Send,
  LogOut,
  Check,
  CheckCheck,
  Trash2,
  Bot,
  Phone,
  Video,
  MessageCircle,
  Users,
  Settings,
} from "lucide-react";
import API from "../api/axios";
import { socket } from "../socket/socket";
import Logo from "../assets/logo";
import { useNavigate } from "react-router-dom";
import { playNotification } from "../utils/notification";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const bottomRef = useRef(null);
  const navigate = useNavigate();

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
  };

  const deleteChat = async () => {
    if (selectedUser?.isAI) {
      setMessages([]);
      return;
    }
    await API.delete(`/chat/delete/${selectedUser._id}`);
    setMessages([]);
  };

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatTime = (time) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ui*/
  return (
    <div className="h-screen flex bg-gray-300">

      {/*left icon bar */}
      <div className="w-16 bg-[#1f2937] text-gray-400 flex flex-col items-center py-4 gap-6">
        <Menu className="md:hidden cursor-pointer" onClick={() => setShowSidebar(!showSidebar)} />
        <MessageCircle />
        <Users />
        <Settings />
      </div>

      {/* sidebar */}
      <div className={`w-80 bg-white border-r fixed md:static h-full z-50
        ${showSidebar ? "block" : "hidden"} md:flex flex-col`}>

        <div className="p-4 border-b">
          <Logo />
        </div>

        {/* ai */}
        <div
          onClick={() => {
            setSelectedUser(AI_ASSISTANT);
            setShowSidebar(false);
          }}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <p className="font-semibold">AI Assistant</p>
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
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 cursor-pointer"
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
              <p className="font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* chat */}
      <div className="flex-1 flex flex-col">

        {/* header */}
        {selectedUser && (
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <div>
              <p className="font-semibold">{selectedUser.username}</p>
              <p className="text-xs text-gray-500">
                {selectedUser.isAI
                  ? "Online"
                  : onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
            <div className="flex gap-4">
              <Phone />
              <Video />
              <Trash2 onClick={deleteChat} />
              <LogOut onClick={logout} />
            </div>
          </div>
        )}

        {/* messages */}
        <div className="flex-1 p-6 overflow-y-auto">

          {!selectedUser && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
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
                  className={`max-w-sm px-4 py-2 rounded-2xl mb-3
                    ${msg.sender === loggedUserId
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-white"}`}
                >
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

          {isLoadingAI && <p className="text-xs text-gray-400">AI thinking…</p>}
          <div ref={bottomRef} />
        </div>

        {/* input */}
        {selectedUser && (
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              className="flex-1 bg-gray-100 rounded-full px-4"
              placeholder="Type a message"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white p-3 rounded-full">
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
