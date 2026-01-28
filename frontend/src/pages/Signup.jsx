import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, MessageCircle, Users, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Logo from "../assets/logo";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    try {
      const res = await API.post("/auth/signup", form);


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    // Ui wrapper
    <div className="min-h-screen flex bg-gradient-to-br from-blue-600 via-purple-600 to-pink-green">
      

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-8">Join us and start chatting today!</p>

          <div className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <User className="text-gray-400 mr-3" size={20} />
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>

          
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <Mail className="text-gray-400 mr-3" size={20} />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <Lock className="text-gray-400 mr-3" size={20} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>

            <button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Sign Up
            </button>
          </div>

        {/*navigation to login */}
          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-purple-600 cursor-pointer font-semibold hover:text-purple-700 transition-colors"
            >
              Login
            </span>
          </p>
        </motion.div>
      </div>

      {/*left branding section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden">
      
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-white text-center">

  
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-2xl">
              <Logo />
            </div>
          </motion.div>

        
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-4"
          >
            Welcome to Convo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl mb-12 text-white/90"
          >
            Connect, Chat, and Collaborate Seamlessly
          </motion.p>

          
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <MessageCircle className="mx-auto mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-1">Real-time Chat</h3>
              <p className="text-sm text-white/80">Instant messaging with friends</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <Shield className="mx-auto mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
              <p className="text-sm text-white/80">Your data is protected</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <Users className="mx-auto mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-1">Chats</h3>
              <p className="text-sm text-white/80">Chat with your friends</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <Zap className="mx-auto mb-3" size={32} />
              <h3 className="font-semibold text-lg mb-1">Lightning Fast</h3>
              <p className="text-sm text-white/80">Optimized performance</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
