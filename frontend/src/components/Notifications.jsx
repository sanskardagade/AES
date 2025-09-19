import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, Info, AlertCircle, Award } from "lucide-react";
import { testAPI } from "../services/api";

export default function Notifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let interval;
    const load = async () => {
      try {
        const stats = await testAPI.getUserStatistics();
        const items = (stats.recentActivity || []).map((a, idx) => ({
          id: idx + 1,
          type: a.type === 'success' ? 'success' : (a.type === 'achievement' ? 'achievement' : 'info'),
          title: a.type === 'test_completed' || a.type === 'success' ? 'Test Update' : 'Activity',
          message: a.text,
          time: a.time,
          read: false,
        }));
        setNotifications(items);
      } catch (e) {
        // ignore
      }
    };
    if (isOpen) {
      load();
      interval = setInterval(load, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [isOpen]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-[#6c9d87]" />;
      case "info":
        return <Info className="w-5 h-5 text-[#0e6994]" />;
      case "achievement":
        return <Award className="w-5 h-5 text-[#e1ab30]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#b0cece]" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          
          {/* Notifications Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-96 bg-white border-l border-[#b0cece] z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#b0cece]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0c2543] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0e6994]" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-[#e18891] text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={onClose}
                  className="text-[#0e6994] hover:text-[#0c2543] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[#0e6994] text-sm hover:text-[#0c2543] transition mt-2"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-[#0e6994]">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#b0cece]" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        notification.read
                          ? "bg-[#b0cece]/20 border-[#b0cece]"
                          : "bg-[#0e6994]/10 border-[#0e6994]/30"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="text-[#0c2543] font-medium text-sm">
                            {notification.title}
                          </h3>
                          <p className="text-[#6c5043] text-xs mt-1">
                            {notification.message}
                          </p>
                          <p className="text-[#0e6994] text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#0e6994] rounded-full mt-2"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}