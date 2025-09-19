"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, X, BookOpen, BarChart3, Settings } from "lucide-react"
import { adminAPI } from "../services/api"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("tests")
  const [tests, setTests] = useState([])
  const [questions, setQuestions] = useState([])
  const [showAddTest, setShowAddTest] = useState(false)
  const [showEditTest, setShowEditTest] = useState(false)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [testForm, setTestForm] = useState({
    title: "",
    subject: "",
    description: "",
    duration_minutes: 60,
    total_questions: 0,
    total_points: 100,
    difficulty: "Intermediate",
  })
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    description: "",
    duration_minutes: 60,
    total_questions: 0,
    total_points: 100,
    difficulty: "Intermediate",
    is_active: true,
  })

  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    points: 1,
  })

  useEffect(() => {
    loadData()
  }, [])

  // Load questions when switching to Questions tab or changing selected test
  useEffect(() => {
    const loadQuestionsForSelected = async () => {
      if (activeTab === "questions" && selectedTest) {
        try {
          const qs = await adminAPI.getQuestions(selectedTest.id)
          setQuestions(qs)
        } catch (e) {
          console.error("Error loading questions:", e)
          setQuestions([])
        }
      }
    }
    loadQuestionsForSelected()
  }, [activeTab, selectedTest])

  const loadData = async () => {
    try {
      setLoading(true)
      const list = await adminAPI.getTests()
      setTests(list)
      if (list.length > 0) {
        setSelectedTest(list[0])
        const qs = await adminAPI.getQuestions(list[0].id)
        setQuestions(qs)
      } else {
        setSelectedTest(null)
        setQuestions([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTest = async () => {
    try {
      const created = await adminAPI.createTest(testForm)
      const next = [created, ...tests]
      setTests(next)
      setSelectedTest(created)
      const qs = await adminAPI.getQuestions(created.id)
      setQuestions(qs)
      setShowAddTest(false)
      setTestForm({
        title: "",
        subject: "",
        description: "",
        duration_minutes: 60,
        total_questions: 0,
        total_points: 100,
        difficulty: "Intermediate",
      })
    } catch (error) {
      console.error("Error adding test:", error)
    }
  }

  const handleAddQuestion = async () => {
    try {
      if (!selectedTest) return
      const created = await adminAPI.createQuestion(selectedTest.id, questionForm)
      setQuestions([...questions, created])
      setShowAddQuestion(false)
      setQuestionForm({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        points: 1,
      })
    } catch (error) {
      console.error("Error adding question:", error)
    }
  }

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return
    try {
      await adminAPI.deleteTest(testId)
      const next = tests.filter((t) => t.id !== testId)
      setTests(next)
      if (selectedTest?.id === testId) {
        const newSelected = next[0] || null
        setSelectedTest(newSelected)
        setQuestions(newSelected ? await adminAPI.getQuestions(newSelected.id) : [])
      }
    } catch (e) {
      console.error("Error deleting test:", e)
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return
    try {
      await adminAPI.deleteQuestion(questionId)
      setQuestions(questions.filter((q) => q.id !== questionId))
      if (selectedTest) {
        const updatedTests = tests.map((t) =>
          t.id === selectedTest.id ? { ...t, total_questions: Math.max(0, (t.total_questions || 0) - 1) } : t,
        )
        setTests(updatedTests)
      }
    } catch (e) {
      console.error("Error deleting question:", e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#0e6994" }}
          ></div>
          <p style={{ color: "#0c2543" }}>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#6c5043" }} className="border-b" style={{ borderColor: "#b0cece" }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#b0cece" }}>
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
              activeTab === "tests" ? "text-white" : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: activeTab === "tests" ? "#0e6994" : "#6c9d87",
              color: "#ffffff",
            }}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Manage Tests
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "questions" ? "text-white" : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: activeTab === "questions" ? "#0e6994" : "#6c9d87",
              color: "#ffffff",
            }}
          >
            <Edit className="w-5 h-5 inline mr-2" />
            Manage Questions
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "analytics" ? "text-white" : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: activeTab === "analytics" ? "#0e6994" : "#6c9d87",
              color: "#ffffff",
            }}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Tests Tab */}
        {activeTab === "tests" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: "#0c2543" }}>
                Tests Management
              </h2>
              <button
                onClick={() => setShowAddTest(true)}
                className="px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
                style={{ backgroundColor: "#7035fd", color: "#ffffff" }}
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
                    setSelectedTest(test)
                    try {
                      const qs = await adminAPI.getQuestions(test.id)
                      setQuestions(qs)
                    } catch (e) {
                      console.error("Error loading questions:", e)
                      setQuestions([])
                    }
                  }}
                  className={`rounded-xl p-6 border cursor-pointer`}
                  style={{
                    backgroundColor: "#b0cece",
                    borderColor: selectedTest?.id === test.id ? "#e1ab30" : "#6c9d87",
                    borderWidth: selectedTest?.id === test.id ? "2px" : "1px",
                  }}
                >
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#0c2543" }}>
                    {test.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#6c5043" }}>
                    {test.subject}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#6c5043" }}>Duration:</span>
                      <span style={{ color: "#0c2543" }}>{test.duration_minutes} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#6c5043" }}>Questions:</span>
                      <span style={{ color: "#0c2543" }}>{test.total_questions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#6c5043" }}>Difficulty:</span>
                      <span style={{ color: "#0c2543" }}>{test.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTest(test)
                        setEditForm({
                          title: test.title,
                          subject: test.subject,
                          description: test.description || "",
                          duration_minutes: test.duration_minutes,
                          total_questions: test.total_questions,
                          total_points: test.total_points,
                          difficulty: test.difficulty,
                          is_active: !!test.is_active,
                        })
                        setShowEditTest(true)
                        adminAPI
                          .getQuestions(test.id)
                          .then(setQuestions)
                          .catch(() => setQuestions([]))
                      }}
                      className="flex-1 py-2 px-3 rounded-lg hover:opacity-90 transition text-sm"
                      style={{ backgroundColor: "#6c9d87", color: "#ffffff" }}
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      className="flex-1 py-2 px-3 rounded-lg hover:opacity-90 transition text-sm"
                      style={{ backgroundColor: "#d44719", color: "#ffffff" }}
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
              <h2 className="text-xl font-bold" style={{ color: "#0c2543" }}>
                Questions Management
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTest?.id || ""}
                  onChange={async (e) => {
                    const id = Number(e.target.value)
                    const t = tests.find((x) => x.id === id) || null
                    setSelectedTest(t)
                    try {
                      const qs = t ? await adminAPI.getQuestions(t.id) : []
                      setQuestions(qs)
                    } catch (err) {
                      console.error("Error loading questions:", err)
                      setQuestions([])
                    }
                  }}
                  className="px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#b0cece",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                >
                  <option value="" disabled>
                    Select test
                  </option>
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.subject})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddQuestion(true)}
                  disabled={!selectedTest}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${selectedTest ? "hover:opacity-90" : "cursor-not-allowed opacity-50"}`}
                  style={{
                    backgroundColor: selectedTest ? "#7035fd" : "#6c5043",
                    color: "#ffffff",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {selectedTest && (
              <div className="mb-6 text-sm">
                <div>
                  <span style={{ color: "#6c5043" }}>Selected Test:</span>{" "}
                  <span className="font-medium" style={{ color: "#0c2543" }}>
                    {selectedTest.title}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#6c5043" }}>Subject:</span>{" "}
                  <span style={{ color: "#0c2543" }}>{selectedTest.subject}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: "#b0cece",
                    borderColor: "#6c9d87",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2" style={{ color: "#0c2543" }}>
                        {question.question_text}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span style={{ color: "#6c5043" }}>A:</span>
                          <span style={{ color: "#0c2543" }}>{question.option_a}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: "#6c5043" }}>B:</span>
                          <span style={{ color: "#0c2543" }}>{question.option_b}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: "#6c5043" }}>C:</span>
                          <span style={{ color: "#0c2543" }}>{question.option_c}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: "#6c5043" }}>D:</span>
                          <span style={{ color: "#0c2543" }}>{question.option_d}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="py-2 px-3 rounded-lg hover:opacity-90 transition text-sm"
                        style={{ backgroundColor: "#6c9d87", color: "#ffffff" }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="py-2 px-3 rounded-lg hover:opacity-90 transition text-sm"
                        style={{ backgroundColor: "#d44719", color: "#ffffff" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span style={{ color: "#0c2543" }}>Correct Answer: {question.correct_answer}</span>
                    <span style={{ color: "#0c2543" }}>{question.points} points</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {(!selectedTest || questions.length === 0) && (
              <div className="text-center text-sm mt-6" style={{ color: "#6c5043" }}>
                {selectedTest ? "No questions found for this test." : "Select or create a test to manage questions."}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: "#0c2543" }}>
              System Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl p-6 border" style={{ backgroundColor: "#b0cece", borderColor: "#6c9d87" }}>
                <h3 className="font-semibold mb-2" style={{ color: "#0c2543" }}>
                  Total Tests
                </h3>
                <p className="text-3xl font-bold" style={{ color: "#0e6994" }}>
                  {tests.length}
                </p>
              </div>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: "#b0cece", borderColor: "#6c9d87" }}>
                <h3 className="font-semibold mb-2" style={{ color: "#0c2543" }}>
                  Total Questions
                </h3>
                <p className="text-3xl font-bold" style={{ color: "#6c9d87" }}>
                  {questions.length}
                </p>
              </div>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: "#b0cece", borderColor: "#6c9d87" }}>
                <h3 className="font-semibold mb-2" style={{ color: "#0c2543" }}>
                  Active Tests
                </h3>
                <p className="text-3xl font-bold" style={{ color: "#e1ab30" }}>
                  {tests.filter((t) => t.is_active).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {showAddTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(108, 80, 67, 0.8)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl border max-w-md w-full mx-4"
            style={{
              backgroundColor: "#b0cece",
              borderColor: "#6c9d87",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: "#0c2543" }}>
                Add New Test
              </h3>
              <button onClick={() => setShowAddTest(false)} className="hover:opacity-70" style={{ color: "#6c5043" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Test Title
                </label>
                <input
                  type="text"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={testForm.subject}
                  onChange={(e) => setTestForm({ ...testForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={testForm.duration_minutes}
                  onChange={(e) => setTestForm({ ...testForm, duration_minutes: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Difficulty
                </label>
                <select
                  value={testForm.difficulty}
                  onChange={(e) => setTestForm({ ...testForm, difficulty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
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
                className="flex-1 py-2 px-4 rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#6c5043", color: "#ffffff" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTest}
                className="flex-1 py-2 px-4 rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#7035fd", color: "#ffffff" }}
              >
                Add Test
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showEditTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(108, 80, 67, 0.8)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl border max-w-md w-full mx-4"
            style={{
              backgroundColor: "#b0cece",
              borderColor: "#6c9d87",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: "#0c2543" }}>
                Edit Test
              </h3>
              <button onClick={() => setShowEditTest(false)} className="hover:opacity-70" style={{ color: "#6c5043" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Test Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={editForm.duration_minutes}
                  onChange={(e) => setEditForm({ ...editForm, duration_minutes: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Total Points
                </label>
                <input
                  type="number"
                  value={editForm.total_points}
                  onChange={(e) => setEditForm({ ...editForm, total_points: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Difficulty
                </label>
                <select
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={!!editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-sm" style={{ color: "#0c2543" }}>
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditTest(false)}
                className="flex-1 py-2 px-4 rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#6c5043", color: "#ffffff" }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedTest) return
                  try {
                    const updated = await adminAPI.updateTest(selectedTest.id, editForm)
                    setTests(tests.map((t) => (t.id === updated.id ? updated : t)))
                    setSelectedTest(updated)
                    setShowEditTest(false)
                  } catch (e) {
                    console.error("Error updating test:", e)
                  }
                }}
                className="flex-1 py-2 px-4 rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#7035fd", color: "#ffffff" }}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(108, 80, 67, 0.8)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl border max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "#b0cece",
              borderColor: "#6c9d87",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: "#0c2543" }}>
                Add New Question
              </h3>
              <button
                onClick={() => setShowAddQuestion(false)}
                className="hover:opacity-70"
                style={{ color: "#6c5043" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedTest && (
              <div className="mb-4 text-sm">
                <div>
                  <span style={{ color: "#6c5043" }}>Test:</span>{" "}
                  <span className="font-medium" style={{ color: "#0c2543" }}>
                    {selectedTest.title}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#6c5043" }}>Subject:</span>{" "}
                  <span style={{ color: "#0c2543" }}>{selectedTest.subject}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                  Question Text
                </label>
                <textarea
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none h-20"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0c2543",
                    borderColor: "#6c9d87",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                    Option A
                  </label>
                  <input
                    type="text"
                    value={questionForm.option_a}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_a: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0c2543",
                      borderColor: "#6c9d87",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                    Option B
                  </label>
                  <input
                    type="text"
                    value={questionForm.option_b}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_b: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0c2543",
                      borderColor: "#6c9d87",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                    Option C
                  </label>
                  <input
                    type="text"
                    value={questionForm.option_c}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_c: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0c2543",
                      borderColor: "#6c9d87",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                    Option D
                  </label>
                  <input
                    type="text"
                    value={questionForm.option_d}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_d: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0c2543",
                      borderColor: "#6c9d87",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                    Correct Answer
                  </label>
                  <select
                    value={questionForm.correct_answer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0c2543",
                      borderColor: "#6c9d87",
                    }}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#0c2543" }}>
                    Points
                  </label>
                  <input
                    type="number"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({ ...questionForm, points: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0c2543",
                      borderColor: "#6c9d87",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddQuestion(false)}
                className="flex-1 py-2 px-4 rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#6c5043", color: "#ffffff" }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleAddQuestion()
                  // refresh from DB after add
                  if (selectedTest) {
                    try {
                      const qs = await adminAPI.getQuestions(selectedTest.id)
                      setQuestions(qs)
                    } catch {}
                  }
                }}
                disabled={!selectedTest}
                className={`flex-1 py-2 px-4 rounded-lg transition ${selectedTest ? "hover:opacity-90" : "cursor-not-allowed opacity-50"}`}
                style={{
                  backgroundColor: selectedTest ? "#7035fd" : "#6c5043",
                  color: "#ffffff",
                }}
              >
                Add Question
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
