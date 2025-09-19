import React from "react";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, PenTool, Shield } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      title: "AI in Education: Transforming Learning",
      desc: "Explore how AI-powered platforms are personalizing learning experiences and improving outcomes.",
      icon: PenTool,
      date: "Sep 1, 2025",
    },
    {
      title: "5 Tips to Improve Your Learning Efficiency",
      desc: "Practical strategies backed by research to enhance your study sessions and retention.",
      icon: BookOpen,
      date: "Aug 20, 2025",
    },
    {
      title: "Platform Updates: New Features in AES",
      desc: "Learn about the latest features and improvements on AES Platform to make your experience better.",
      icon: MessageCircle,
      date: "Aug 10, 2025",
    },
    {
      title: "Data Security in EdTech: What You Should Know",
      desc: "An in-depth look at how AES Platform ensures data privacy and secure learning environments.",
      icon: Shield,
      date: "Jul 30, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-[#b0cece] relative overflow-hidden">
      {/* Background subtle circles */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-72 h-72 bg-[#0e6994]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-[#7035fd]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center"
      >
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#0c2543] mb-4">
          AES Blog
        </h1>
        <p className="text-[#6c5043] mb-12 text-lg md:text-xl max-w-3xl mx-auto">
          Stay updated with the latest news, tips, and insights in education, technology, and AES Platform features.
        </p>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-[#ffffff] backdrop-blur-md rounded-2xl p-6 border border-[#b0cece] shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-start mb-4 space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#0e6994] to-[#7035fd] rounded-xl">
                  <post.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-[#0c2543]">{post.title}</h3>
                  <p className="text-[#6c5043] text-sm">{post.date}</p>
                </div>
              </div>
              <p className="text-[#444444] mb-4 text-sm">{post.desc}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-auto bg-gradient-to-r from-[#0e6994] to-[#7035fd] text-white py-2 px-6 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
                onClick={() => window.location.href = "/blog-detail"}
              >
                Read More
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
