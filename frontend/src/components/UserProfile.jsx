import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, Award, BarChart3, FileText, X, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { profileAPI } from "../services/api";
import { useContext } from "react";

export default function UserProfile({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ branch: "", phone: "", roll: "" });

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile Settings",
      action: async () => {
        try {
          const p = await profileAPI.get();
          setProfileForm({ branch: p.branch || "", phone: p.phone || "", roll: p.roll || "" });
        } catch {
          const saved = localStorage.getItem('profile');
          if (saved) setProfileForm(JSON.parse(saved));
        }
        setShowEditProfile(true);
      }
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      action: () => {
        navigate("/analytics");
        onClose();
      }
    },
    {
      icon: Award,
      label: "My Certificates",
      action: () => {
        navigate("/certificates");
        onClose();
      }
    },
    {
      icon: FileText,
      label: "Test History",
      action: () => {
        console.log("Test history clicked");
        onClose();
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Profile Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 right-4 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{user?.name || "User"}</h3>
                  <p className="text-gray-400 text-sm">{user?.email || "user@example.com"}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:text-white transition"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-700 p-2">
              <motion.button
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-6 py-3 text-left text-red-400 hover:text-red-300 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Logout Confirmation Modal */}
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-sm mx-4"
                >
                  <h3 className="text-white font-semibold mb-2">Confirm Logout</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Are you sure you want to logout? You'll need to login again to access your account.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Profile Modal */}
          <AnimatePresence>
            {showEditProfile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-sm mx-4 w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2"><Edit3 className="w-4 h-4"/> Edit Profile</h3>
                    <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Branch</label>
                      {(() => {
                        const engineeringBranches = [
                          "Computer Science Engineering",
                          "Information Technology",
                          "Electronics and Communication Engineering",
                          "Electrical Engineering",
                          "Electrical and Electronics Engineering",
                          "Mechanical Engineering",
                          "Civil Engineering",
                          "Chemical Engineering",
                          "Aerospace Engineering",
                          "Automobile Engineering",
                          "Industrial Engineering",
                          "Instrumentation Engineering",
                          "Production Engineering",
                          "Mechatronics Engineering",
                          "Metallurgical and Materials Engineering",
                          "Biotechnology Engineering",
                          "Biomedical Engineering",
                          "Environmental Engineering",
                          "Agricultural Engineering",
                          "Petroleum Engineering",
                          "Mining Engineering",
                          "Marine Engineering",
                          "Robotics and Automation",
                        ];

                        return (
                          <select
                            value={profileForm.branch}
                            onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                          >
                            <option value="">Select your branch</option>
                            {engineeringBranches.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Phone</label>
                      <input value={profileForm.phone} onChange={(e)=>setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"/>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Roll No</label>
                      <input value={profileForm.roll} onChange={(e)=>setProfileForm({...profileForm, roll: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"/>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={()=>setShowEditProfile(false)} className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={async ()=>{ 
                      try { await profileAPI.update(profileForm); } catch { /* fallback local */ localStorage.setItem('profile', JSON.stringify(profileForm)); }
                      setShowEditProfile(false); onClose(); 
                    }} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">Save</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
