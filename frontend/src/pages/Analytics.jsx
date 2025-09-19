import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BarChart3,
  PieChart,
  Calendar,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { testAPI } from "../services/api";

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalTests: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    bestSubject: "N/A",
    improvement: 0,
    recentScores: [],
    subjectBreakdown: [],
    monthlyProgress: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock analytics data - in real app, this would come from API
      const mockAnalytics = {
        totalTests: 12,
        averageScore: 87,
        totalTimeSpent: 480, // minutes
        bestSubject: "Mathematics",
        improvement: 15,
        recentScores: [85, 92, 78, 88, 95, 82, 90, 87],
        subjectBreakdown: [
          { subject: "Mathematics", score: 89, tests: 4 },
          { subject: "Computer Science", score: 85, tests: 3 },
          { subject: "Physics", score: 82, tests: 3 },
          { subject: "Chemistry", score: 88, tests: 2 }
        ],
        monthlyProgress: [
          { month: "Jan", tests: 3, avgScore: 82 },
          { month: "Feb", tests: 4, avgScore: 85 },
          { month: "Mar", tests: 5, avgScore: 87 }
        ]
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Analytics Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tests</p>
                <p className="text-3xl font-bold text-white">{analytics.totalTests}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-green-400">{analytics.averageScore}%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Time Spent</p>
                <p className="text-3xl font-bold text-yellow-400">{analytics.totalTimeSpent}m</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Best Subject</p>
                <p className="text-3xl font-bold text-purple-400">{analytics.bestSubject}</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Scores Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Performance
            </h3>
            <div className="h-64 flex items-end gap-2">
              {analytics.recentScores.map((score, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-full transition-all duration-500"
                    style={{ height: `${(score / 100) * 200}px` }}
                  ></div>
                  <span className="text-gray-400 text-xs mt-2">{score}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subject Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Subject Performance
            </h3>
            <div className="space-y-4">
              {analytics.subjectBreakdown.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-white">{subject.subject}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{subject.score}%</div>
                    <div className="text-gray-400 text-sm">{subject.tests} tests</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.monthlyProgress.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">{month.avgScore}%</div>
                  <div className="text-gray-400 text-sm mb-1">{month.month}</div>
                  <div className="text-gray-500 text-xs">{month.tests} tests</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
