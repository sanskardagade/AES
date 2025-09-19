import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X,
  BookOpen,
  Users,
  BarChart3,
  Settings
} from "lucide-react";
import { adminAPI } from "../services/api";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("tests");
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showEditTest, setShowEditTest] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [testForm, setTestForm] = useState({
    title: "",
    subject: "",
    description: "",
    duration_minutes: 60,
    total_questions: 0,
    total_points: 100,
    difficulty: "Intermediate"
  });
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    description: "",
    duration_minutes: 60,
    total_questions: 0,
    total_points: 100,
    difficulty: "Intermediate",
    is_active: true,
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    points: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  // Load questions when switching to Questions tab or changing selected test
  useEffect(() => {
    const loadQuestionsForSelected = async () => {
      if (activeTab === "questions" && selectedTest) {
        try {
          const qs = await adminAPI.getQuestions(selectedTest.id);
          setQuestions(qs);
        } catch (e) {
          console.error("Error loading questions:", e);
          setQuestions([]);
        }
      }
    };
    loadQuestionsForSelected();
  }, [activeTab, selectedTest]);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await adminAPI.getTests();
      setTests(list);
      if (list.length > 0) {
        setSelectedTest(list[0]);
        const qs = await adminAPI.getQuestions(list[0].id);
        setQuestions(qs);
      } else {
        setSelectedTest(null);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async () => {
    try {
      const created = await adminAPI.createTest(testForm);
      const next = [created, ...tests];
      setTests(next);
      setSelectedTest(created);
      const qs = await adminAPI.getQuestions(created.id);
      setQuestions(qs);
      setShowAddTest(false);
      setTestForm({
        title: "",
        subject: "",
        description: "",
        duration_minutes: 60,
        total_questions: 0,
        total_points: 100,
        difficulty: "Intermediate"
      });
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      if (!selectedTest) return;
      const created = await adminAPI.createQuestion(selectedTest.id, questionForm);
      setQuestions([...questions, created]);
      setShowAddQuestion(false);
      setQuestionForm({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        points: 1
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await adminAPI.deleteTest(testId);
      const next = tests.filter(t => t.id !== testId);
      setTests(next);
      if (selectedTest?.id === testId) {
        const newSelected = next[0] || null;
        setSelectedTest(newSelected);
        setQuestions(newSelected ? await adminAPI.getQuestions(newSelected.id) : []);
      }
    } catch (e) {
      console.error("Error deleting test:", e);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await adminAPI.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      if (selectedTest) {
        const updatedTests = tests.map(t => t.id === selectedTest.id ? { ...t, total_questions: Math.max(0, (t.total_questions || 0) - 1) } : t);
        setTests(updatedTests);
      }
    } catch (e) {
      console.error("Error deleting question:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
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
            <Settings className="w-6 h-6" />
            Admin Panel
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "tests"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Manage Tests
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "questions"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Edit className="w-5 h-5 inline mr-2" />
            Manage Questions
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Tests Tab */}
        {activeTab === "tests" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Tests Management</h2>
              <button
                onClick={() => setShowAddTest(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Test
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={async () => {
                    setSelectedTest(test);
                    try {
                      const qs = await adminAPI.getQuestions(test.id);
                      setQuestions(qs);
                    } catch (e) {
                      console.error("Error loading questions:", e);
                      setQuestions([]);
                    }
                  }}
                  className={`bg-gray-800 rounded-xl p-6 border ${selectedTest?.id === test.id ? 'border-blue-500' : 'border-gray-700'} cursor-pointer`}
                >
                  <h3 className="text-white font-bold text-lg mb-2">{test.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{test.subject}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{test.duration_minutes} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Questions:</span>
                      <span className="text-white">{test.total_questions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className="text-white">{test.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedTest(test);
                        setEditForm({
                          title: test.title,
                          subject: test.subject,
                          description: test.description || "",
                          duration_minutes: test.duration_minutes,
                          total_questions: test.total_questions,
                          total_points: test.total_points,
                          difficulty: test.difficulty,
                          is_active: !!test.is_active,
                        });
                        setShowEditTest(true);
                        adminAPI.getQuestions(test.id).then(setQuestions).catch(() => setQuestions([]));
                      }}
                      className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition text-sm">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">Questions Management</h2>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTest?.id || ''}
                  onChange={async (e) => {
                    const id = Number(e.target.value);
                    const t = tests.find(x => x.id === id) || null;
                    setSelectedTest(t);
                    try {
                      const qs = t ? await adminAPI.getQuestions(t.id) : [];
                      setQuestions(qs);
                    } catch (err) {
                      console.error('Error loading questions:', err);
                      setQuestions([]);
                    }
                  }}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                >
                  <option value="" disabled>Select test</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.subject})</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddQuestion(true)}
                  disabled={!selectedTest}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${selectedTest ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {selectedTest && (
              <div className="mb-6 text-sm text-gray-300">
                <div><span className="text-gray-400">Selected Test:</span> <span className="text-white font-medium">{selectedTest.title}</span></div>
                <div><span className="text-gray-400">Subject:</span> <span className="text-white">{selectedTest.subject}</span></div>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2">{question.question_text}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">A:</span>
                          <span className="text-white">{question.option_a}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">B:</span>
                          <span className="text-white">{question.option_b}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">C:</span>
                          <span className="text-white">{question.option_c}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">D:</span>
                          <span className="text-white">{question.option_d}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="bg-gray-700 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition text-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-400">Correct Answer: {question.correct_answer}</span>
                    <span className="text-blue-400">{question.points} points</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {(!selectedTest || questions.length === 0) && (
              <div className="text-center text-gray-400 text-sm mt-6">{selectedTest ? 'No questions found for this test.' : 'Select or create a test to manage questions.'}</div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">System Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Total Tests</h3>
                <p className="text-3xl font-bold text-blue-400">{tests.length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Total Questions</h3>
                <p className="text-3xl font-bold text-green-400">{questions.length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Active Tests</h3>
                <p className="text-3xl font-bold text-yellow-400">{tests.filter(t => t.is_active).length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {showAddTest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add New Test</h3>
              <button
                onClick={() => setShowAddTest(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Test Title</label>
                <input
                  type="text"
                  value={testForm.title}
                  onChange={(e) => setTestForm({...testForm, title: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={testForm.subject}
                  onChange={(e) => setTestForm({...testForm, subject: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={testForm.duration_minutes}
                  onChange={(e) => setTestForm({...testForm, duration_minutes: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
                <select
                  value={testForm.difficulty}
                  onChange={(e) => setTestForm({...testForm, difficulty: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTest(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTest}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Add Test
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showEditTest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Edit Test</h3>
              <button
                onClick={() => setShowEditTest(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Test Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={editForm.duration_minutes}
                  onChange={(e) => setEditForm({...editForm, duration_minutes: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Total Points</label>
                <input
                  type="number"
                  value={editForm.total_points}
                  onChange={(e) => setEditForm({...editForm, total_points: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
                <select
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input id="isActive" type="checkbox" checked={!!editForm.is_active} onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})} />
                <label htmlFor="isActive" className="text-gray-300 text-sm">Active</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditTest(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedTest) return;
                  try {
                    const updated = await adminAPI.updateTest(selectedTest.id, editForm);
                    setTests(tests.map(t => t.id === updated.id ? updated : t));
                    setSelectedTest(updated);
                    setShowEditTest(false);
                  } catch (e) {
                    console.error('Error updating test:', e);
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add New Question</h3>
              <button
                onClick={() => setShowAddQuestion(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedTest && (
              <div className="mb-4 text-sm text-gray-300">
                <div><span className="text-gray-400">Test:</span> <span className="text-white font-medium">{selectedTest.title}</span></div>
                <div><span className="text-gray-400">Subject:</span> <span className="text-white">{selectedTest.subject}</span></div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Question Text</label>
                <textarea
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Option A</label>
                  <input
                    type="text"
                    value={questionForm.option_a}
                    onChange={(e) => setQuestionForm({...questionForm, option_a: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Option B</label>
                  <input
                    type="text"
                    value={questionForm.option_b}
                    onChange={(e) => setQuestionForm({...questionForm, option_b: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Option C</label>
                  <input
                    type="text"
                    value={questionForm.option_c}
                    onChange={(e) => setQuestionForm({...questionForm, option_c: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Option D</label>
                  <input
                    type="text"
                    value={questionForm.option_d}
                    onChange={(e) => setQuestionForm({...questionForm, option_d: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Correct Answer</label>
                  <select
                    value={questionForm.correct_answer}
                    onChange={(e) => setQuestionForm({...questionForm, correct_answer: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Points</label>
                  <input
                    type="number"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({...questionForm, points: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddQuestion(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleAddQuestion();
                  // refresh from DB after add
                  if (selectedTest) {
                    try {
                      const qs = await adminAPI.getQuestions(selectedTest.id);
                      setQuestions(qs);
                    } catch {}
                  }
                }}
                disabled={!selectedTest}
                className={`flex-1 py-2 px-4 rounded-lg transition ${selectedTest ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                Add Question
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
