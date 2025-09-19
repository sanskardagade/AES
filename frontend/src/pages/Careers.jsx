import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Code, Monitor } from "lucide-react";

export default function Careers() {
  const positions = [
    {
      title: "Frontend Developer",
      desc: "Work on React-based web applications and deliver exceptional UI/UX.",
      icon: Code,
      location: "Remote / India",
    },
    {
      title: "Backend Developer",
      desc: "Develop scalable APIs and manage database integrations.",
      icon: Monitor,
      location: "Remote / India",
    },
    {
      title: "Data Scientist",
      desc: "Build AI/ML models to enhance our platform capabilities.",
      icon: Users,
      location: "Remote / India",
    },
    {
      title: "Product Manager",
      desc: "Lead cross-functional teams to define and deliver product roadmap.",
      icon: Briefcase,
      location: "Remote / India",
    },
  ];

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
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center"
      >
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Join Our Team
        </h1>
        <p className="text-gray-300 mb-12 text-lg md:text-xl max-w-3xl mx-auto">
          AES Platform is looking for passionate individuals to help shape the future of learning. Explore our open positions and become part of an innovative team.
        </p>

        {/* Job Positions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {positions.map((position, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-start mb-4 space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <position.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">{position.title}</h3>
                  <p className="text-gray-400 text-sm">{position.location}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 text-sm">{position.desc}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
                onClick={() => window.location.href = "/contact"}
              >
                Apply Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
