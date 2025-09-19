import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white text-blue-zodiac relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-jet-stream/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-jet-stream/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-jet-stream/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center"
      >
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-zodiac mb-6">Contact Us</h1>
        <p className="text-blue-zodiac/70 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          Have questions or need support? Fill out the form below, and our team will get back to you as soon as possible.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-chill rounded-full">
              <Mail className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-blue-zodiac font-semibold">Email</h3>
              <p className="text-blue-zodiac/70 text-sm">support@aesplatform.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-chill rounded-full">
              <Phone className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-blue-zodiac font-semibold">Phone</h3>
              <p className="text-blue-zodiac/70 text-sm">+1 234 567 890</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-chill rounded-full">
              <MapPin className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-blue-zodiac font-semibold">Address</h3>
              <p className="text-blue-zodiac/70 text-sm">123 AES Street, Learning City, World</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-jet-stream/50 shadow-md text-left">
          <div className="mb-4">
            <label className="text-blue-zodiac/70 font-semibold">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-2 px-4 py-3 bg-jet-stream/50 text-blue-zodiac border border-jet-stream rounded-lg focus:ring-2 focus:ring-blue-chill outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="text-blue-zodiac/70 font-semibold">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-2 px-4 py-3 bg-jet-stream/50 text-blue-zodiac border border-jet-stream rounded-lg focus:ring-2 focus:ring-blue-chill outline-none"
            />
          </div>
          <div className="mb-6">
            <label className="text-blue-zodiac/70 font-semibold">Message</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full mt-2 px-4 py-3 bg-jet-stream/50 text-blue-zodiac border border-jet-stream rounded-lg focus:ring-2 focus:ring-blue-chill outline-none"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-chill text-white py-3 rounded-lg font-semibold shadow-2xl hover:bg-blue-zodiac transition"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
