import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, TrendingUp, Clock, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, title: "Smart Assessments", desc: "AI-powered questions that adapt to your skill level" },
    { icon: Shield, title: "Secure Testing", desc: "Advanced proctoring and anti-cheating measures" },
    { icon: TrendingUp, title: "Real-time Analytics", desc: "Detailed performance insights and progress tracking" },
    { icon: Clock, title: "Flexible Scheduling", desc: "Take tests anytime, anywhere with our mobile platform" },
    { icon: Target, title: "Personalized Learning", desc: "Custom study paths based on your strengths and weaknesses" },
    { icon: Award, title: "Instant Certification", desc: "Get verified certificates upon successful completion" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center"
      >
        {/* Hero */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">AES Platform Features</h1>
        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          Explore the cutting-edge features of AES Platform designed to enhance your learning and assessment experience.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-md transition"
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
            onClick={() => navigate("/signup")}
          >
            Get Started Today
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
