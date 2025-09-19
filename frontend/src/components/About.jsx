import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Award, BookOpen, Target, Shield } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, title: "Smart Assessments", desc: "AI-powered adaptive tests tailored to your learning style." },
    { icon: Shield, title: "Secure Testing", desc: "Advanced proctoring and anti-cheating measures to ensure integrity." },
    { icon: Target, title: "Personalized Learning", desc: "Custom study paths based on your strengths and weaknesses." },
    { icon: Award, title: "Certifications", desc: "Earn verified certificates upon successful completion of assessments." },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Subtle animated background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center"
      >
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          About AES Platform
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          AES Platform empowers learners worldwide with AI-powered assessments,
          personalized learning paths, and verified certifications. Our mission is
          to make learning engaging, effective, and accessible to everyone.
        </p>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-md transition"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 mx-auto">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-10 rounded-2xl font-semibold shadow-2xl cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Join AES Platform Today
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
