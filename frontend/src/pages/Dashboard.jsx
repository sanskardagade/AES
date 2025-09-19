import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { testAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications";
import UserProfile from "../components/UserProfile";
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  Bell, 
  BarChart3, 
  Play, 
  FileText, 
  Users, 
  Calendar,
  Star,
  Trophy,
  Target,
  TrendingUp,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  // State for real data
  const [availableTests, setAvailableTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [statistics, setStatistics] = useState({
    testsCompleted: "0",
    averageScore: "0%",
    totalPoints: "0",
    rank: "#0"
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [availableData, completedData, statsData] = await Promise.all([
        testAPI.getAvailableTests(),
        testAPI.getCompletedTests(),
        testAPI.getUserStatistics()
      ]);

      setAvailableTests(availableData);
      setCompletedTests(completedData);
      setStatistics({
        testsCompleted: statsData.testsCompleted.toString(),
        averageScore: statsData.averageScore,
        totalPoints: statsData.totalPoints,
        rank: statsData.rank
      });
      setRecentActivity(statsData.recentActivity || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    try {
      const result = await testAPI.startTest(testId);
      console.log("Test started:", result);
      // Navigate to test interface
      navigate(`/test/${testId}`);
    } catch (err) {
      console.error("Error starting test:", err);
      alert("Failed to start test. Please try again.");
    }
  };

  const handleViewResults = (testId) => {
    // Navigate to results page or show modal
    console.log("View results for test:", testId);
    alert("Results page would open here");
  };

  // Statistics icons
  const stats = [
    { label: "Tests Completed", value: statistics.testsCompleted, icon: CheckCircle, color: "text-oxley" },
    { label: "Average Score", value: statistics.averageScore, icon: Target, color: "text-blue-chill" },
    { label: "Total Points", value: statistics.totalPoints, icon: Trophy, color: "text-golden-grass" },
    { label: "Rank", value: statistics.rank, icon: TrendingUp, color: "text-electric-violet" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-chill animate-spin mx-auto mb-4" />
          <p className="text-blue-zodiac text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-orange-roughy text-lg mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-chill text-white px-6 py-2 rounded-lg hover:bg-blue-zodiac transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-jet-stream/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-petite-orchid/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-oxley/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-zodiac mb-2">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-blue-zodiac/70">Ready to ace your next exam?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(true)}
                className="text-blue-zodiac hover:text-blue-chill transition"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-3 h-3 bg-orange-roughy rounded-full"></span>
              </button>
            </div>
            <button
              onClick={() => setShowUserProfile(true)}
              className="w-10 h-10 bg-blue-chill rounded-full flex items-center justify-center hover:opacity-90 transition"
            >
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0) || "S"}
              </span>
            </button>
          </div>
      </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
          <motion.div
            key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-jet-stream/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-zodiac/70 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tests Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-jet-stream/20 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-jet-stream">
                <button
                  onClick={() => setActiveTab("available")}
                  className={`px-6 py-4 font-medium transition ${
                    activeTab === "available"
                      ? "text-blue-chill border-b-2 border-blue-chill"
                      : "text-blue-zodiac/70 hover:text-blue-zodiac"
                  }`}
                >
                  Available Tests ({availableTests.length})
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-6 py-4 font-medium transition ${
                    activeTab === "completed"
                      ? "text-blue-chill border-b-2 border-blue-chill"
                      : "text-blue-zodiac/70 hover:text-blue-zodiac"
                  }`}
                >
                  Completed ({completedTests.length})
                </button>
              </div>

              {/* Test Cards */}
              <div className="p-6">
                {activeTab === "available" ? (
                  <div className="space-y-4">
                    {availableTests.map((test) => (
                      <motion.div
                        key={test.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-jet-stream/50 rounded-lg p-6 border border-jet-stream/50 hover:border-blue-chill/50 transition"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-blue-zodiac font-bold text-lg mb-2">{test.title}</h3>
                            <p className="text-blue-zodiac/70 text-sm mb-3">{test.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {test.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-chill/20 text-blue-chill text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              test.difficulty === "Advanced" 
                                ? "bg-orange-roughy/20 text-orange-roughy"
                                : "bg-golden-grass/20 text-golden-grass"
                            }`}>
                              {test.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-6 text-sm text-blue-zodiac/70">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {test.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {test.questions} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {test.points} points
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStartTest(test.id)}
                            className="bg-blue-chill text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-zodiac transition"
                          >
                            <Play className="w-4 h-4" />
                            Start Test
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
        <div className="space-y-4">
                    {completedTests.map((test) => (
                      <motion.div
                        key={test.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-jet-stream/50 rounded-lg p-6 border border-jet-stream/50 hover:border-oxley/50 transition"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-blue-zodiac font-bold text-lg mb-2">{test.title}</h3>
                            <p className="text-blue-zodiac/70 text-sm">{test.subject}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-oxley">
                              {test.score}/{test.maxScore}
                            </div>
                            <div className="text-sm text-blue-zodiac/70">
                              {Math.round((test.score / test.maxScore) * 100)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-blue-zodiac/70">
                          <div className="flex gap-4">
                            <span>Completed: {test.completedAt}</span>
                            <span>Duration: {test.duration}</span>
                          </div>
                          <button 
                            onClick={() => handleViewResults(test.id)}
                            className="text-blue-chill hover:text-blue-zodiac transition"
                          >
                            View Results
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-jet-stream/20">
              <h3 className="text-blue-zodiac font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "success" ? "bg-oxley" :
                        activity.type === "achievement" ? "bg-golden-grass" : "bg-blue-chill"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-blue-zodiac/70 text-sm">{activity.text}</p>
                        <p className="text-blue-zodiac/50 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-blue-zodiac/50 text-sm">No recent activity</p>
                )}
              </div>
      </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-jet-stream/20">
              <h3 className="text-blue-zodiac font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-blue-chill text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-zodiac transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse All Tests
                </button>
                <button 
                  onClick={() => navigate("/analytics")}
                  className="w-full bg-jet-stream text-blue-zodiac py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-oxley transition"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </button>
                <button 
                  onClick={() => navigate("/certificates")}
                  className="w-full bg-jet-stream text-blue-zodiac py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-oxley transition"
                >
                  <Award className="w-4 h-4" />
                  My Certificates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <Notifications 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </div>
  );
}
