import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Circle,
  Flag,
  RotateCcw,
  Send
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { testAPI } from "../services/api";

export default function TestInterface() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mock test data - in real app, this would come from API
  const mockTest = {
    id: testId,
    title: "Mathematics - Advanced Level",
    duration: 90, // minutes
    questions: [
      {
        id: 1,
        question: "What is the derivative of x² + 3x + 2?",
        options: ["2x + 3", "2x + 2", "x + 3", "2x + 5"],
        correct: 0
      },
      {
        id: 2,
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 3", "x = 5", "x = 6"],
        correct: 0
      },
      {
        id: 3,
        question: "What is the area of a circle with radius 5?",
        options: ["25π", "10π", "50π", "5π"],
        correct: 0
      },
      {
        id: 4,
        question: "Find the limit as x approaches 0 of (sin x)/x",
        options: ["0", "1", "∞", "undefined"],
        correct: 1
      },
      {
        id: 5,
        question: "What is the integral of 2x?",
        options: ["x²", "x² + C", "2x²", "x² + 2x"],
        correct: 1
      }
    ]
  };

  useEffect(() => {
    loadTest();
  }, [testId]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestWithQuestions(testId);
      const testData = response.test || response; // Handle both response formats
      setTest(testData);
      setTimeLeft(testData.duration * 60); // Convert to seconds
    } catch (error) {
      console.error("Error loading test:", error);
      alert("Failed to load test");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      test.questions.forEach(question => {
        if (answers[question.id] === question.correct) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / test.questions.length) * 100);
      const timeTaken = Math.floor((test.duration * 60 - timeLeft) / 60);
      
      // Submit results
      await testAPI.submitTestResults(1, score, timeTaken); // Mock attempt ID
      
      alert(`Test completed! Your score: ${score}%`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / test.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#b0cece] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e6994] mx-auto mb-4"></div>
          <p className="text-[#0c2543]">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-[#b0cece] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#0c2543] text-lg mb-4">Test not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#0e6994] text-white px-6 py-2 rounded-lg hover:bg-[#0c2543] transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = test.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#b0cece]">
      {/* Header */}
      <div className="bg-white border-b border-[#b0cece] shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-[#0e6994] hover:text-[#0c2543] transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#0c2543]">{test.title}</h1>
                <p className="text-[#0e6994] text-sm">
                  Question {currentQuestion + 1} of {test.questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#0c2543]">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#6c9d87] text-white px-4 py-2 rounded-lg hover:bg-[#0c2543] transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-[#b0cece] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#0e6994] to-[#7035fd] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-[#b0cece] shadow-sm sticky top-32">
              <h3 className="text-[#0c2543] font-semibold mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                {test.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition ${
                      index === currentQuestion
                        ? "bg-[#0e6994] text-white"
                        : answers[question.id] !== undefined
                        ? "bg-[#6c9d87] text-white"
                        : "bg-[#b0cece] text-[#0c2543] hover:bg-[#0e6994] hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-8 border border-[#b0cece] shadow-sm"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0c2543] mb-6">
                  {currentQ.question}
                </h2>
                
                <div className="space-y-4">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full p-4 rounded-lg border text-left transition ${
                        answers[currentQ.id] === index
                          ? "border-[#0e6994] bg-[#0e6994]/10 text-[#0c2543]"
                          : "border-[#b0cece] bg-white text-[#0c2543] hover:border-[#0e6994] hover:bg-[#b0cece]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {answers[currentQ.id] === index ? (
                          <CheckCircle className="w-5 h-5 text-[#0e6994]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#b0cece]" />
                        )}
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="bg-[#b0cece] text-[#0c2543] px-6 py-3 rounded-lg hover:bg-[#0e6994] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === test.questions.length - 1}
                  className="bg-[#0e6994] text-white px-6 py-3 rounded-lg hover:bg-[#0c2543] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}