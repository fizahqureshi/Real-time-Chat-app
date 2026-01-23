import { useEffect, useState, useRef } from "react";
import {
  Menu,
  Send,
  LogOut,
  Check,
  CheckCheck,
  Trash2,
  Bot,
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
  const [typing, setTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // Virtual AI Assistant user
  const AI_ASSISTANT = {
    _id: "ai",
    username: "AI Assistant",
    isAI: true,
  };

  // token 
  const token = localStorage.getItem("token");
  const loggedUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;

  // auth
  useEffect(() => {
    if (!loggedUserId) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [loggedUserId, navigate]);

  // users load
  useEffect(() => {
    API.get("/users").then(res => {
      setUsers(res.data.filter(u => u._id !== loggedUserId));
    });
  }, [loggedUserId]);

  // socket ko connect 
  useEffect(() => {
    if (!loggedUserId) return;

    socket.connect(); 
    socket.emit("join", loggedUserId);

    socket.on("onlineUsers", users => {
      setOnlineUsers(users);
    });

    socket.on("typing", ({ from }) => {
      if (from === selectedUser?._id) setTyping(true);
    });

    socket.on("stopTyping", () => setTyping(false));

    // realtime message
    socket.on("receiveMessage", msg => {
      // sound
      if (msg.sender !== loggedUserId) {
        playNotification();
      }

      // open chat
      if (
        selectedUser &&
        (msg.sender === selectedUser._id ||
          msg.receiver === selectedUser._id)
      ) {
        setMessages(prev => [...prev, msg]);
      }

      // user ko top le aana
      setUsers(prev => {
        const uid =
          msg.sender === loggedUserId ? msg.receiver : msg.sender;
        const user = prev.find(u => u._id === uid);
        if (!user) return prev;

        return [user, ...prev.filter(u => u._id !== uid)];
      });
    });

    //  notification
    socket.on("notification", ({ from, text }) => {
      if (from !== selectedUser?._id) {
        playNotification();
      }
    });

  
    socket.on("seen", ({ from }) => {
      if (from === selectedUser?._id) {
        setMessages(prev =>
          prev.map(m =>
            m.sender === loggedUserId ? { ...m, seen: true } : m
          )
        );
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("receiveMessage");
      socket.off("notification");
      socket.off("seen");
    };
  }, [loggedUserId, selectedUser]);


  useEffect(() => {
    if (!selectedUser) return;

    // AI Assistant 
    if (selectedUser.isAI) {
      setMessages([]);
      setShowSidebar(false);
      return;
    }

    API.get(`/chat/${selectedUser._id}`).then(res => {
      setMessages(res.data);

      // seen mark karna
      const unseenMessages = res.data.filter(
        m => m.sender === selectedUser._id && !m.seen
      );

      unseenMessages.forEach(msg => {
        socket.emit("seen", {
          messageId: msg._id,
          to: selectedUser._id,
        });
      });
    });

    setShowSidebar(false);
  }, [selectedUser]);

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    // handle AI Assistant message
    if (selectedUser.isAI) {
      const userMessage = {
        _id: Date.now().toString(),
        sender: loggedUserId,
        receiver: "ai",
        text: text,
        seen: true,
      };
      setMessages(prev => [...prev, userMessage]);
      setText("");
      setIsLoadingAI(true);

      try {
        const res = await API.post("/ai/chat", { message: text });
        const aiMessage = {
          _id: (Date.now() + 1).toString(),
          sender: "ai",
          receiver: loggedUserId,
          text: res.data.reply,
          seen: true,
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err) {
        const errorMessage = {
          _id: (Date.now() + 1).toString(),
          sender: "ai",
          receiver: loggedUserId,
          text: "Sorry, I encountered an error. Please try again.",
          seen: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoadingAI(false);
      }
      return;
    }

    // Regular user message
    const res = await API.post("/chat/send", {
      receiverId: selectedUser._id,
      text,
    });

    const newMsg = res.data;
    setMessages(prev => [...prev, newMsg]);
    setText("");
    socket.emit("stopTyping", { to: selectedUser._id });

    
    socket.emit("sendMessage", newMsg);

    // user ko top le aana
    setUsers(prev => {
      const user = prev.find(u => u._id === selectedUser._id);
      if (!user) return prev;
      return [user, ...prev.filter(u => u._id !== selectedUser._id)];
    });
  };

  // delete chat
  const deleteChat = async () => {
    if (selectedUser?.isAI) {
      setMessages([]);
      return;
    }
    await API.delete(`/chat/delete/${selectedUser._id}`);
    setMessages([]);
  };

  // logout
  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    navigate("/");
  };

  // user jab typing kar raha ho
  const handleTyping = e => {
    setText(e.target.value);
    
    // Don't emit socket events for AI Assistant
    if (selectedUser?.isAI) return;

    socket.emit("typing", { to: selectedUser._id });

    setTimeout(() => {
      socket.emit("stopTyping", { to: selectedUser._id });
    }, 800);
  };

  return (
    <div className="h-screen flex bg-gray-50">


     {/* Sidebar */}
      <div className={`w-72 bg-purple-300 border-r ${showSidebar ? "" : "hidden md:block"}`}>
        <div className="p-4 border-b flex gap-2">
          <Logo />
        </div>

        {/* AI Assistant */}
        <div
          onClick={() => setSelectedUser(AI_ASSISTANT)}
          className={`p-3 hover:bg-purple-50 cursor-pointer flex items-center gap-2 ${
            selectedUser?._id === "ai" ? "bg-purple-100 border-l-4 border-purple-600" : ""
          }`}
        >
          <Bot size={18} className="text-blue-600" />
          <div className="flex-1">
            <span className="font-semibold">{AI_ASSISTANT.username}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        </div>

        {users.map(user => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`p-3 hover:bg-purple-50 cursor-pointer ${
              selectedUser?._id === user._id ? "bg-purple-100 border-l-4 border-purple-600" : ""
            }`}
          >
            <div className="flex justify-between">
              <span>{user.username}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  onlineUsers.includes(user._id)
                    ? "bg-green-500"
                    : "bg-red-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b flex justify-between">
          <div className="flex gap-2">
            <Menu onClick={() => setShowSidebar(!showSidebar)} />
            <h2>{selectedUser?.username}</h2>
          </div>

          <div className="flex gap-4">
            <Trash2 onClick={deleteChat} className="cursor-pointer" />
            <LogOut onClick={logout} className="cursor-pointer" />
          </div>
        </div>
          <h1 className="text-center mt-4 text-gray-900 font-semibold">
          {selectedUser
            ? `Chating with ${selectedUser.username}`
            : "Select a user to start chat"}
        </h1>
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map(msg => (
            <div
              key={msg._id}
              className={`px-4 py-2 rounded-xl max-w-xs
              ${msg.sender === loggedUserId
                ? "bg-purple-600 text-white ml-auto"
                : "bg-white border"}`}
            >
              {msg.text}
              {msg.sender === loggedUserId && !selectedUser?.isAI && (
                <div className="flex justify-end">
                  {msg.seen ? <CheckCheck size={14} /> : <Check size={14} />}
                </div>
              )}
            </div>
          ))}

          {typing && !selectedUser?.isAI && (
            <p className="text-xs text-gray-500">Typing...</p>
          )}

          {isLoadingAI && selectedUser?.isAI && (
            <p className="text-xs text-gray-500">AI is thinking...</p>
          )}

          <div ref={bottomRef} />
        </div>

        {selectedUser && (
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              value={text}
              onChange={handleTyping}
              className="flex-1 bg-gray-100 rounded-full px-4"
              placeholder="Message..."
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 p-3 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
