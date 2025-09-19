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
        return { 
          color: "bg-[#6c9d87]", 
          icon: <CheckCircle className="w-5 h-5 text-[#6c9d87]" /> 
        };
      case "offline":
        return { 
          color: "bg-[#e18891]", 
          icon: <AlertTriangle className="w-5 h-5 text-[#e18891]" /> 
        };
      case "maintenance":
        return { 
          color: "bg-[#e1ab30]", 
          icon: <Clock className="w-5 h-5 text-[#e1ab30]" /> 
        };
      default:
        return { color: "bg-[#b0cece]", icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-[#b0cece] relative overflow-hidden">
      {/* Background subtle circles */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-72 h-72 bg-[#0c2543]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-[#0e6994]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20"
      >
        <h1 className="text-5xl font-extrabold text-[#0c2543] text-center mb-4">
          AES Platform System Status
        </h1>
        <p className="text-[#0e6994] text-center mb-12">
          Real-time monitoring of all critical services. Stay updated on system health.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map((system, index) => {
            const statusProps = getStatusProps(system.status);
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#0c2543]/20 shadow-lg flex flex-col justify-between transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Server className="w-6 h-6 text-[#0c2543]" />
                    <span className="text-[#0c2543] font-semibold">{system.name}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${statusProps.color} animate-pulse`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {statusProps.icon}
                    <span className="text-[#6c5043] capitalize">{system.status}</span>
                  </div>
                  <span className="text-[#0e6994] text-sm">{system.lastChecked}</span>
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
            className="bg-gradient-to-r from-[#0e6994] to-[#7035fd] text-white py-3 px-10 rounded-2xl font-semibold shadow-2xl"
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}