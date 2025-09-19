import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const { login, loading, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    const result = await login({ email, password });
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative overflow-hidden">
      {/* Optional subtle background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-jet-stream/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-jet-stream/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-jet-stream/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 text-center border border-jet-stream/20"
      >
        <h2 className="text-3xl font-extrabold text-blue-zodiac mb-6">Welcome Back 👋</h2>
        <p className="text-blue-zodiac/70 mb-6 text-sm">Login to continue to AES Platform</p>

        {/* Error Message */}
        {(formError || error) && (
          <div className="mb-4 p-3 bg-petite-orchid/20 border border-orange-roughy/50 rounded-lg text-orange-roughy text-sm">
            {formError || error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3 text-blue-zodiac/40" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 bg-jet-stream/50 text-blue-zodiac border border-jet-stream rounded-lg focus:ring-2 focus:ring-blue-chill outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-3 text-blue-zodiac/40" size={20} />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 bg-jet-stream/50 text-blue-zodiac border border-jet-stream rounded-lg focus:ring-2 focus:ring-blue-chill outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-chill text-white py-3 rounded-lg font-semibold shadow-2xl hover:bg-blue-zodiac transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-jet-stream"></div>
          <span className="px-3 text-blue-zodiac/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-jet-stream"></div>
        </div>

        {/* Sign Up Link */}
        <p className="text-sm text-blue-zodiac/70 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-chill font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
