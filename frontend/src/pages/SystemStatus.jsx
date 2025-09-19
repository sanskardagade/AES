import React from "react";
import { motion } from "framer-motion";
import { Server, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function SystemStatus() {
  const systems = [
    { name: "Authentication Server", status: "online", lastChecked: "5 mins ago" },
    { name: "Database Server", status: "online", lastChecked: "3 mins ago" },
    { name: "API Gateway", status: "maintenance", lastChecked: "10 mins ago" },
    { name: "Payment Gateway", status: "offline", lastChecked: "15 mins ago" },
    { name: "Email Service", status: "online", lastChecked: "2 mins ago" },
  ];

  const getStatusProps = (status) => {
    switch (status) {
      case "online":
        return { color: "bg-green-500", icon: <CheckCircle className="w-5 h-5 text-green-500" /> };
      case "offline":
        return { color: "bg-red-500", icon: <AlertTriangle className="w-5 h-5 text-red-500" /> };
      case "maintenance":
        return { color: "bg-yellow-500", icon: <Clock className="w-5 h-5 text-yellow-500" /> };
      default:
        return { color: "bg-gray-500", icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background subtle circles */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-72 h-72 bg-gray-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20"
      >
        <h1 className="text-5xl font-extrabold text-white text-center mb-4">
          AES Platform System Status
        </h1>
        <p className="text-gray-300 text-center mb-12">
          Real-time monitoring of all critical services. Stay updated on system health.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map((system, index) => {
            const statusProps = getStatusProps(system.status);
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Server className="w-6 h-6 text-white" />
                    <span className="text-white font-semibold">{system.name}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${statusProps.color} animate-pulse`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {statusProps.icon}
                    <span className="text-gray-300 capitalize">{system.status}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{system.lastChecked}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = "/contact"}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-10 rounded-2xl font-semibold shadow-2xl"
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
