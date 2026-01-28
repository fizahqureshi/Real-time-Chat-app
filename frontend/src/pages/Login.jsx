import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, MessageCircle, Shield, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Logo from "../assets/logo";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-600 via-purple-600 to-green-500">

      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-white text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-2xl">
              <Logo />
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-xl mb-12 text-white/90">
            Login and continue your conversations
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
              <MessageCircle className="mx-auto mb-3" size={32} />
              <p className="font-semibold">Instant Chat</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
              <Shield className="mx-auto mb-3" size={32} />
              <p className="font-semibold">Secure</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
              <Users className="mx-auto mb-3" size={32} />
              <p className="font-semibold">Friends</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
              <Zap className="mx-auto mb-3" size={32} />
              <p className="font-semibold">Fast</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LOGIN FORM SECTION (RIGHT) - LOGIC UNCHANGED ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your credentials to continue
          </p>

          <div className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
              <Mail className="text-gray-400 mr-3" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
              <Lock className="text-gray-400 mr-3" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Login
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-600 cursor-pointer font-semibold"
            >
              Signup
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
