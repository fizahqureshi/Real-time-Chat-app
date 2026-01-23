// import { useState } from "react";
// import { Mail, Lock } from "lucide-react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";
// import Logo from "../assets/logo";

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async () => {
//     try {
//       const res = await API.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/chat");
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-600 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
//       >
//         <div className="flex justify-center mb-6">
//           <Logo />
//         </div>

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Login to Convo
//         </h2>

//         <div className="space-y-4">
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-xl"
//           />

//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-xl"
//           />

//           <button
//             onClick={handleLogin}
//             className="w-full bg-purple-600 text-white py-2 rounded-xl"
//           >
//             Login
//           </button>
//         </div>

//         <p className="text-sm text-center mt-6">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="text-purple-600 cursor-pointer font-semibold"
//           >
//             Sign up
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// }


import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
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

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ GO TO CHAT
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-600 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Convo 
        </h2>

        <div className="space-y-4">
          <div className="flex items-center border rounded-xl px-3">
            <Mail className="text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <Lock className="text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-3 py-2 outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-center mt-6">
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
  );
}
