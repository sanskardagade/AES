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
  const [modal, setModal] = useState({ open: false, tab: 'history' });
  const [details, setDetails] = useState({ tests: [] });

  useEffect(() => {
    let unsubscribe = null;
    const init = async () => {
      try {
        setLoading(true);
        const snap = await testAPI.getUserAnalytics();
        setAnalytics(snap);
        // Preload details for modals
        const done = await testAPI.getCompletedTests();
        setDetails({ tests: done });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
      try {
        unsubscribe = testAPI.subscribeAnalytics((live) => {
          setAnalytics((prev) => ({ ...prev, ...live }));
        });
      } catch (e) {
        // ignore SSE failure; page will still show snapshot
      }
    };
    init();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // removed mock fetchAnalytics; now uses API + SSE

  if (loading) {
    return (
      <div className="min-h-screen bg-[#b0cece] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e6994] mx-auto mb-4"></div>
          <p className="text-[#0c2543]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#b0cece]">
      {/* Header */}
      <div className="bg-[#0c2543] shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#ffffff] hover:text-[#e1ab30] transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#ffffff] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#e1ab30]" />
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
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece] cursor-pointer"
            onClick={() => setModal({ open: true, tab: 'history' })}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tests</p>
                <p className="text-3xl font-bold text-[#0c2543]">{analytics.totalTests}</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#0e6994]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece] cursor-pointer"
            onClick={() => setModal({ open: true, tab: 'scores' })}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-[#6c9d87]">{analytics.averageScore}%</p>
              </div>
              <Target className="w-8 h-8 text-[#6c9d87]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece] cursor-pointer"
            onClick={() => setModal({ open: true, tab: 'time' })}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Time Spent</p>
                <p className="text-3xl font-bold text-[#e1ab30]">{analytics.totalTimeSpent}m</p>
              </div>
              <Clock className="w-8 h-8 text-[#e1ab30]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece] cursor-pointer"
            onClick={() => setModal({ open: true, tab: 'subject' })}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Best Subject</p>
                <p className="text-2xl font-bold text-[#7035fd]">{analytics.bestSubject}</p>
              </div>
              <Award className="w-8 h-8 text-[#7035fd]" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Scores Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece] cursor-pointer"
            onClick={() => setModal({ open: true, tab: 'chart' })}
          >
            <h3 className="text-xl font-bold text-[#0c2543] mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0e6994]" />
              Recent Performance
            </h3>
            <div className="h-64 flex items-end gap-2">
              {analytics.recentScores.map((score, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="rounded-t w-full transition-all duration-500"
                    style={{
                      height: `${(score / 100) * 200}px`,
                      background: "linear-gradient(to top, #0e6994, #7035fd)"
                    }}
                  ></div>
                  <span className="text-gray-600 text-xs mt-2">{score}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subject Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece]"
          >
            <h3 className="text-xl font-bold text-[#0c2543] mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#d44719]" />
              Subject Performance
            </h3>
            <div className="space-y-4">
              {analytics.subjectBreakdown.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ background: "linear-gradient(to right, #0e6994, #7035fd)" }}></div>
                    <span className="text-[#0c2543]">{subject.subject}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[#0c2543] font-semibold">{subject.score}%</div>
                    <div className="text-gray-500 text-sm">{subject.tests} tests</div>
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
            className="bg-[#ffffff] rounded-xl p-6 shadow border border-[#b0cece] lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-[#0c2543] mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#6c5043]" />
              Monthly Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.monthlyProgress.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-[#d44719] mb-2">{month.avgScore}%</div>
                  <div className="text-[#0c2543] text-sm mb-1">{month.month}</div>
                  <div className="text-gray-500 text-xs">{month.tests} tests</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex gap-3 text-sm">
                <button className={`px-3 py-1 rounded ${modal.tab==='history'?'bg-[#0e6994] text-white':'bg-gray-100'}`} onClick={() => setModal(m => ({...m, tab:'history'}))}>History</button>
                <button className={`px-3 py-1 rounded ${modal.tab==='scores'?'bg-[#0e6994] text-white':'bg-gray-100'}`} onClick={() => setModal(m => ({...m, tab:'scores'}))}>Scores</button>
                <button className={`px-3 py-1 rounded ${modal.tab==='time'?'bg-[#0e6994] text-white':'bg-gray-100'}`} onClick={() => setModal(m => ({...m, tab:'time'}))}>Time</button>
                <button className={`px-3 py-1 rounded ${modal.tab==='chart'?'bg-[#0e6994] text-white':'bg-gray-100'}`} onClick={() => setModal(m => ({...m, tab:'chart'}))}>Chart</button>
              </div>
              <button className="text-gray-600 hover:text-black" onClick={() => setModal({ open:false, tab:'history' })}>✕</button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-auto">
              {modal.tab === 'history' && (
                <div className="space-y-3">
                  {details.tests.length === 0 && (<div className="text-gray-500 text-sm">No tests yet</div>)}
                  {details.tests.map(t => (
                    <div key={t.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <div className="font-semibold text-[#0c2543]">{t.title}</div>
                        <div className="text-xs text-gray-500">{t.subject} • {t.completedAt}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-[#0c2543] font-semibold">{t.percentage}%</div>
                        <div className="text-gray-500">{t.score}/{t.maxScore} • {t.timeTaken}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modal.tab === 'scores' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.tests.map(t => (
                    <div key={t.id} className="border rounded-lg p-3">
                      <div className="font-semibold text-[#0c2543] mb-1">{t.title}</div>
                      <div className="text-[#6c9d87] text-2xl font-bold">{t.percentage}%</div>
                      <div className="text-sm text-gray-500">{t.score}/{t.maxScore}</div>
                    </div>
                  ))}
                </div>
              )}

              {modal.tab === 'time' && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">Total time across tests: <span className="font-semibold text-[#e1ab30]">{analytics.totalTimeSpent} minutes</span></div>
                  {details.tests.map(t => (
                    <div key={t.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="font-medium text-[#0c2543]">{t.title}</div>
                      <div className="text-[#e1ab30] font-semibold">{t.timeTaken}m</div>
                    </div>
                  ))}
                </div>
              )}

              {modal.tab === 'chart' && (
                <div>
                  <div className="text-[#0c2543] font-semibold mb-4">Recent Performance (expanded)</div>
                  <div className="h-80 flex items-end gap-2">
                    {analytics.recentScores.map((score, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="rounded-t w-full transition-all duration-500"
                          style={{ height: `${(score / 100) * 280}px`, background: "linear-gradient(to top, #0e6994, #7035fd)" }}
                        ></div>
                        <span className="text-gray-600 text-xs mt-2">{score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
