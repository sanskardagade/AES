import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Award, 
  Download,
  Eye,
  Search,
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
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterSubject === "all" || student.department === filterSubject;
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
    if (score >= 90) return "text-[#6c9d87]"; // Oxley
    if (score >= 80) return "text-[#e1ab30]"; // Golden Grass
    if (score >= 70) return "text-[#d44719]"; // Orange Roughy
    return "text-[#e18891]"; // Petite Orchid
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-[#6c9d87]/20";
    if (score >= 80) return "bg-[#e1ab30]/20";
    if (score >= 70) return "bg-[#d44719]/20";
    return "bg-[#e18891]/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c2543] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e6994] mx-auto mb-4"></div>
          <p className="text-[#ffffff]">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c2543]">
      {/* Header */}
      <div className="bg-[#0e6994] border-b border-[#6c9d87]/40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-[#ffffff] flex items-center gap-2">
            <Users className="w-6 h-6" />
            Placement Officer Dashboard
          </h1>
          <p className="text-[#b0cece]">Monitor student progress and performance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div className="bg-[#0e6994]/80 rounded-xl p-6 border border-[#b0cece]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#b0cece] text-sm">Total Students</p>
                <p className="text-3xl font-bold text-[#ffffff]">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-[#7035fd]" />
            </div>
          </motion.div>

          <motion.div className="bg-[#0e6994]/80 rounded-xl p-6 border border-[#b0cece]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#b0cece] text-sm">Average Score</p>
                <p className="text-3xl font-bold text-[#6c9d87]">
                  {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-[#6c9d87]" />
            </div>
          </motion.div>

          <motion.div className="bg-[#0e6994]/80 rounded-xl p-6 border border-[#b0cece]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#b0cece] text-sm">Tests Completed</p>
                <p className="text-3xl font-bold text-[#e1ab30]">
                  {students.reduce((acc, s) => acc + s.testsCompleted, 0)}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-[#e1ab30]" />
            </div>
          </motion.div>

          <motion.div className="bg-[#0e6994]/80 rounded-xl p-6 border border-[#b0cece]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#b0cece] text-sm">Top Performers</p>
                <p className="text-3xl font-bold text-[#7035fd]">
                  {students.filter(s => s.averageScore >= 90).length}
                </p>
              </div>
              <Award className="w-8 h-8 text-[#7035fd]" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#0e6994]/40 rounded-xl p-6 border border-[#b0cece]/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#b0cece]" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0c2543] text-white rounded-lg border border-[#6c9d87]/40 focus:border-[#7035fd] outline-none"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-[#0c2543] text-white px-4 py-2 rounded-lg border border-[#6c9d87]/40 focus:border-[#7035fd] outline-none"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0c2543] text-white px-4 py-2 rounded-lg border border-[#6c9d87]/40 focus:border-[#7035fd] outline-none"
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
              className="bg-[#0e6994]/30 rounded-xl p-6 border border-[#b0cece]/20 hover:border-[#7035fd]/50 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#6c9d87] to-[#7035fd] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{student.name}</h3>
                    <p className="text-[#b0cece] text-sm">{student.email}</p>
                    <p className="text-[#6c5043] text-xs">
                      {student.department} • {student.year}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(student.averageScore)} ${getScoreColor(student.averageScore)}`}
                  >
                    {student.averageScore}% Average
                  </div>
                  <p className="text-[#b0cece] text-sm mt-1">Rank #{student.rank}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Performance Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#b0cece]">Tests Completed:</span>
                      <span className="text-white">{student.testsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#b0cece]">Total Points:</span>
                      <span className="text-white">{student.totalPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#b0cece]">Average Score:</span>
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
                        <span className="text-[#b0cece] truncate">{test.test}</span>
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
                      <span className="text-[#6c9d87]">Strengths:</span>
                      <p className="text-[#b0cece] text-xs">
                        {student.strengths.join(", ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#e18891]">Areas to Improve:</span>
                      <p className="text-[#b0cece] text-xs">
                        {student.weaknesses.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-[#6c9d87] to-[#7035fd] text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="bg-[#6c5043] text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                <button className="bg-gradient-to-r from-[#e1ab30] to-[#d44719] text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Recommend
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-[#b0cece] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No students found
            </h3>
            <p className="text-[#b0cece]">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
