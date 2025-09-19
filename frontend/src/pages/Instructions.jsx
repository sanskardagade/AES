import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, ListChecks, AlertTriangle } from "lucide-react";

export default function Instructions() {
  const { attemptId } = useParams();

  // Mock data - in a real app, this would be fetched based on the test
  const testDetails = {
    title: "Advanced JavaScript Concepts",
    duration: "60 minutes",
    questions: 50,
    description: "This test assesses your knowledge of advanced JavaScript topics including closures, promises, and async/await."
  };

  const instructions = [
    "Ensure you have a stable internet connection.",
    "Do not refresh the page during the test.",
    "The test is timed. Make sure to complete it within the given duration.",
    "Once you start the test, you cannot pause it.",
    "Answers are saved automatically. You can review them before submitting."
  ];

  return (
    <div className="min-h-screen bg-white text-blue-zodiac flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-jet-stream/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-jet-stream/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-jet-stream/50"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-zodiac mb-2">Test Instructions</h1>
          <p className="text-blue-zodiac/70">Read these instructions carefully before starting.</p>
        </div>

        {/* Test Details Card */}
        <div className="bg-jet-stream/40 p-6 rounded-xl mb-6 border border-jet-stream/60">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-8 h-8 text-blue-chill" />
            <div>
              <h2 className="text-2xl font-bold text-blue-zodiac">{testDetails.title}</h2>
              <p className="text-blue-zodiac/70">{testDetails.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-zodiac/70" />
              <span className="font-medium">Duration:</span>
              <span>{testDetails.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-blue-zodiac/70" />
              <span className="font-medium">Questions:</span>
              <span>{testDetails.questions}</span>
            </div>
          </div>
        </div>

        {/* Instructions List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-zodiac mb-3">Please note the following:</h3>
          <ul className="space-y-2 text-blue-zodiac/80">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-chill rounded-full flex-shrink-0"></div>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Warning */}
        <div className="flex items-center gap-3 bg-petite-orchid/20 p-4 rounded-lg mb-8 border border-petite-orchid/30">
          <AlertTriangle className="w-8 h-8 text-orange-roughy flex-shrink-0" />
          <p className="text-sm text-orange-roughy/80">
            Any form of cheating or malpractice will result in automatic disqualification. Please maintain the integrity of the assessment.
          </p>
        </div>

        {/* Start Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-center"
        >
          <Link 
            to={`/test/${attemptId}`} 
            className="w-full inline-block bg-blue-chill text-white py-4 px-10 rounded-xl font-semibold shadow-2xl hover:bg-blue-zodiac transition text-lg"
          >
            Start Test
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
