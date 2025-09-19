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
            className="fixed top-16 right-4 w-80 bg-white border border-[#b0cece] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#b0cece]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#0e6994] to-[#7035fd] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-[#0c2543] font-semibold">{user?.name || "User"}</h3>
                  <p className="text-[#0e6994] text-sm">{user?.email || "user@example.com"}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: "rgba(14, 105, 148, 0.1)" }}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-6 py-3 text-left text-[#0c2543] hover:text-[#0e6994] transition"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Logout Section */}
            <div className="border-t border-[#b0cece] p-2">
              <motion.button
                whileHover={{ backgroundColor: "rgba(225, 136, 145, 0.1)" }}
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-6 py-3 text-left text-[#e18891] hover:text-[#d44719] transition"
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
                  className="bg-white p-6 rounded-xl border border-[#b0cece] max-w-sm mx-4"
                >
                  <h3 className="text-[#0c2543] font-semibold mb-2">Confirm Logout</h3>
                  <p className="text-[#0e6994] text-sm mb-4">
                    Are you sure you want to logout? You'll need to login again to access your account.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 bg-[#b0cece] text-[#0c2543] py-2 px-4 rounded-lg hover:bg-[#0e6994] hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-[#e18891] text-white py-2 px-4 rounded-lg hover:bg-[#d44719] transition"
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
                  className="bg-white p-6 rounded-xl border border-[#b0cece] max-w-sm mx-4 w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#0c2543] font-semibold flex items-center gap-2"><Edit3 className="w-4 h-4"/> Edit Profile</h3>
                    <button onClick={() => setShowEditProfile(false)} className="text-[#0e6994] hover:text-[#0c2543]"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[#0e6994] text-sm mb-1">Branch</label>
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
                            className="w-full bg-[#b0cece]/30 text-[#0c2543] px-3 py-2 rounded-lg border border-[#b0cece] focus:border-[#0e6994] outline-none"
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
                      <label className="block text-[#0e6994] text-sm mb-1">Phone</label>
                      <input value={profileForm.phone} onChange={(e)=>setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-[#b0cece]/30 text-[#0c2543] px-3 py-2 rounded-lg border border-[#b0cece] focus:border-[#0e6994] outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[#0e6994] text-sm mb-1">Roll No</label>
                      <input value={profileForm.roll} onChange={(e)=>setProfileForm({...profileForm, roll: e.target.value})} className="w-full bg-[#b0cece]/30 text-[#0c2543] px-3 py-2 rounded-lg border border-[#b0cece] focus:border-[#0e6994] outline-none"/>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={()=>setShowEditProfile(false)} className="flex-1 bg-[#b0cece] text-[#0c2543] py-2 px-4 rounded-lg hover:bg-[#0e6994] hover:text-white transition">Cancel</button>
                    <button onClick={async ()=>{ 
                      try { await profileAPI.update(profileForm); } catch { /* fallback local */ localStorage.setItem('profile', JSON.stringify(profileForm)); }
                      setShowEditProfile(false); onClose(); 
                    }} className="flex-1 bg-[#0e6994] text-white py-2 px-4 rounded-lg hover:bg-[#0c2543] transition">Save</button>
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