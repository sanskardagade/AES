import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Award, 
  BarChart3,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  BookOpen,
  Target
} from "lucide-react";
import { placementAPI } from "../services/api";

export default function PlacementOfficer() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);
  const initialLoadRef = useRef(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  useEffect(() => {
    loadStudentData();
    // Poll every 5 seconds for real-time updates
    pollingRef.current = setInterval(loadStudentData, 5000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const loadStudentData = async () => {
    try {
      if (initialLoadRef.current) setLoading(true);
      const fresh = await placementAPI.getStudents();
      setStudents(Array.isArray(fresh) ? fresh : (fresh.students || []));
    } catch (error) {
      console.error("Error loading student data:", error);
    } finally {
      if (initialLoadRef.current) {
        setLoading(false);
        initialLoadRef.current = false;
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSubject === "all" || student.department === filterSubject;
    return matchesSearch && matchesFilter;
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.averageScore - a.averageScore;
      case "tests":
        return b.testsCompleted - a.testsCompleted;
      case "points":
        return b.totalPoints - a.totalPoints;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-500/20";
    if (score >= 80) return "bg-yellow-500/20";
    if (score >= 70) return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            Placement Officer Dashboard
          </h1>
          <p className="text-gray-400">Monitor student progress and performance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-white">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
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
                <p className="text-3xl font-bold text-green-400">
                  {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
                </p>
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
                <p className="text-gray-400 text-sm">Tests Completed</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {students.reduce((acc, s) => acc + s.testsCompleted, 0)}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-yellow-400" />
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
                <p className="text-gray-400 text-sm">Top Performers</p>
                <p className="text-3xl font-bold text-purple-400">
                  {students.filter(s => s.averageScore >= 90).length}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              >
                <option value="score">Sort by Score</option>
                <option value="tests">Sort by Tests</option>
                <option value="points">Sort by Points</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-6">
          {sortedStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{student.name}</h3>
                    <p className="text-gray-400 text-sm">{student.email}</p>
                    <p className="text-gray-500 text-xs">{student.department} • {student.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(student.averageScore)} ${getScoreColor(student.averageScore)}`}>
                    {student.averageScore}% Average
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Rank #{student.rank}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Performance Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tests Completed:</span>
                      <span className="text-white">{student.testsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Points:</span>
                      <span className="text-white">{student.totalPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Score:</span>
                      <span className={`font-semibold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Recent Tests</h4>
                  <div className="space-y-1 text-sm">
                    {student.recentTests.slice(0, 3).map((test, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-400 truncate">{test.test}</span>
                        <span className={`font-medium ${getScoreColor(test.score)}`}>
                          {test.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-green-400">Strengths:</span>
                      <p className="text-gray-300 text-xs">{student.strengths.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-red-400">Areas to Improve:</span>
                      <p className="text-gray-300 text-xs">{student.weaknesses.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Recommend
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
