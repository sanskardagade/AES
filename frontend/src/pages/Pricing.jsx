import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      title: "Basic",
      price: "$9/mo",
      features: [
        "Access to basic assessments",
        "Limited analytics",
        "Community support",
      ],
    },
    {
      title: "Pro",
      price: "$29/mo",
      features: [
        "All Basic features",
        "Advanced analytics",
        "Priority support",
        "Personalized learning paths",
      ],
    },
    {
      title: "Enterprise",
      price: "Contact Us",
      features: [
        "All Pro features",
        "Team management",
        "Dedicated account manager",
        "Custom solutions",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c2543] relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0e6994]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7035fd]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#6c9d87]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center"
      >
        {/* Hero */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Pricing Plans
        </h1>
        <p className="text-[#b0cece] text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          Choose a plan that fits your learning goals and unlock the full potential of AES Platform.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`bg-[#0e6994]/10 backdrop-blur-md rounded-2xl p-8 border shadow-md transition
                ${
                  index === 1
                    ? "border-[#7035fd]/50 shadow-2xl bg-[#0e6994]/20"
                    : "border-white/10"
                }`}
            >
              <h3 className="text-2xl font-bold text-white mb-4">{plan.title}</h3>
              <p className="text-3xl font-extrabold text-[#e1ab30] mb-6">
                {plan.price}
              </p>
              <ul className="text-[#b0cece] mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="w-full bg-gradient-to-r from-[#0e6994] to-[#7035fd] text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
              >
                Choose Plan
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block bg-gradient-to-r from-[#0e6994] to-[#7035fd] text-white py-4 px-10 rounded-2xl font-semibold shadow-lg cursor-pointer hover:opacity-90 transition"
            onClick={() => navigate("/signup")}
          >
            Start Your Free Trial Today
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
