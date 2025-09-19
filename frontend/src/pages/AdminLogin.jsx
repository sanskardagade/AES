import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Users, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Mock authentication - in real app, this would be an API call
      const validCredentials = {
        admin: { username: "admin", password: "admin123" },
        placement_officer: { username: "placement_officer", password: "placement123" }
      };

      const credentials = validCredentials[formData.role];
      
      if (formData.username === credentials.username && formData.password === credentials.password) {
        // Store role in localStorage
        localStorage.setItem("adminRole", formData.role);
        
        // Navigate based on role
        if (formData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/placement-officer");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c2543] flex items-center justify-center relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0e6994]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7035fd]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 text-center border border-[#b0cece]/20"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-[#b0cece] hover:text-white transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Admin Access
          </h2>
          <div></div>
        </div>

        <p className="text-[#b0cece] mb-6 text-sm">Login to access admin or placement officer dashboard</p>

        {error && (
          <div className="mb-4 p-3 bg-[#d44719]/20 border border-[#d44719]/50 rounded-lg text-[#d44719] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-[#b0cece] text-sm mb-2 text-left">Access Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "admin"})}
                className={`p-3 rounded-lg border transition ${
                  formData.role === "admin"
                    ? "border-[#0e6994] bg-[#0e6994]/10 text-[#b0cece]"
                    : "border-[#6c5043] bg-[#6c5043]/50 text-[#b0cece] hover:border-[#9a7b6f]"
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "placement_officer"})}
                className={`p-3 rounded-lg border transition ${
                  formData.role === "placement_officer"
                    ? "border-[#0e6994] bg-[#0e6994]/10 text-[#b0cece]"
                    : "border-[#6c5043] bg-[#6c5043]/50 text-[#b0cece] hover:border-[#9a7b6f]"
                }`}
              >
                <Users className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Placement Officer</span>
              </button>
            </div>
          </div>

          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-[#b0cece] text-sm mb-2 text-left">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-[#1a2f5a] text-white border border-[#6c5043] rounded-lg focus:ring-2 focus:ring-[#0e6994] outline-none"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-[#b0cece] text-sm mb-2 text-left">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-[#1a2f5a] text-white border border-[#6c5043] rounded-lg focus:ring-2 focus:ring-[#0e6994] outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0e6994] to-[#7035fd] text-white py-3 rounded-lg font-semibold shadow-2xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-[#1a2f5a]/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2 text-sm">Demo Credentials:</h3>
          <div className="text-xs text-[#b0cece] space-y-1">
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Placement Officer:</strong> placement_officer / placement123</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}