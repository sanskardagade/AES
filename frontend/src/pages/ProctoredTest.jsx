import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Circle,
  Camera,
  CameraOff,
  AlertTriangle,
  Send,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { testAPI } from "../services/api";

export default function ProctoredTest() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const storageKeyRef = useRef(`testProgress_${testId}`);
  
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [fullscreenReady, setFullscreenReady] = useState(false);
  const violationCountRef = useRef(0);
  const violationHandledRef = useRef(false);
  const submittedRef = useRef(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const faceCheckIntervalRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const lastFaceWarnRef = useRef(0);
  const fullscreenIntervalRef = useRef(null);  // Multi-face detection enforcement
  const multiFaceViolationCountRef = useRef(0);
  const multiFaceActiveRef = useRef(false);

  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      // Safari/iOS
      // @ts-ignore
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      // Safari/iOS
      // @ts-ignore
      else if (document.webkitFullscreenElement) await document.webkitExitFullscreen();
    } catch (err) {
      console.warn("Exit fullscreen failed:", err);
    }
  };

  const startFullscreenEnforcement = () => {
    const check = async () => {
      if (submittedRef.current) return;
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isFs && timerActive) {
        showSecurityAlert('Fullscreen is required during the test. Restoring fullscreen.');
        await enterFullscreen();
      }
    };
    // Clear existing
    if (fullscreenIntervalRef.current) clearInterval(fullscreenIntervalRef.current);
    fullscreenIntervalRef.current = setInterval(check, 8000);
    document.addEventListener('fullscreenchange', check);
    // @ts-ignore
    document.addEventListener('webkitfullscreenchange', check);
  };

  const stopFullscreenEnforcement = () => {
    if (fullscreenIntervalRef.current) {
      clearInterval(fullscreenIntervalRef.current);
      fullscreenIntervalRef.current = null;
    }
    // Listeners are lightweight; leaving them is acceptable, but attempt to remove with no-op
  };

  useEffect(() => {
    loadTest();
    disableCopyPaste();
    const onOnline = () => { setIsOnline(true); if (!submittedRef.current) setTimerActive(true); };
    const onOffline = () => { setIsOnline(false); setTimerActive(false); saveProgress(); };
    const onKeyDown = async (e) => {
      if (e.key === 'Escape' && timerActive && !submittedRef.current) {
        e.preventDefault();
        showSecurityAlert('Fullscreen is required during the test. Restoring fullscreen.');
        await enterFullscreen();
      }
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('beforeunload', saveProgress);
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeunload', saveProgress);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [testId]);

  const disableCopyPaste = () => {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable copy, cut, paste
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
        showSecurityAlert('Copy/Paste is disabled during the test');
      }
      
      // Disable F12, Ctrl+Shift+I, Ctrl+U
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        showSecurityAlert('Developer tools are disabled during the test');
      }
    });

    // Disable text selection
    document.addEventListener('selectstart', (e) => e.preventDefault());
    
    // Disable drag and drop
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
  };

  const showSecurityAlert = (message) => {
    alert(`⚠️ SECURITY ALERT: ${message}`);
  };

  const loadTest = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestWithQuestions(testId);
      const testData = response.test || response; // Handle both response formats
      setTest(testData);

      // Start the test attempt BEFORE starting timer
      const startResult = await testAPI.startTest(testId);
      setAttemptId(startResult.attemptId);

      // Try to restore progress from storage
      const savedRaw = localStorage.getItem(storageKeyRef.current);
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          if (saved && saved.attemptId === startResult.attemptId && saved.testId === testData.id) {
            setAnswers(saved.answers || {});
            setCurrentQuestion(saved.currentQuestion || 0);
            const maxSeconds = testData.duration * 60;
            setTimeLeft(Math.max(0, Math.min(maxSeconds, saved.timeLeft != null ? saved.timeLeft : maxSeconds)));
          } else {
            setTimeLeft(testData.duration * 60);
          }
        } catch {
          setTimeLeft(testData.duration * 60);
        }
      } else {
        setTimeLeft(testData.duration * 60); // Convert to seconds
      }
      // Do not start timer yet; wait until user grants camera and fullscreen
      setTimerActive(false);
    } catch (error) {
      console.error("Error loading test:", error);
      alert("Failed to load test");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = () => {
    try {
      if (!attemptId || !test || submittedRef.current) return;
      const payload = {
        testId: test.id,
        attemptId,
        currentQuestion,
        answers,
        timeLeft,
        ts: Date.now(),
      };
      localStorage.setItem(storageKeyRef.current, JSON.stringify(payload));
    } catch {}
  };

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.muted = true;
        video.setAttribute('playsinline', 'true');
        streamRef.current = stream;

        // Wait for metadata, then play
        await new Promise((resolve) => {
          if (video.readyState >= 1) return resolve();
          video.onloadedmetadata = () => resolve();
        });
        try {
          await video.play();
        } catch (e) {
          // Retry once shortly after
          setTimeout(() => { video.play().catch(() => {}); }, 150);
        }

        setCameraActive(true);
        setCameraError(false);
        // Start face monitoring if supported
        startFaceMonitoring();
        setCameraReady(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(true);
      setCameraActive(false);
    }
  };

  const handleVisibilityViolation = () => {
    if (violationHandledRef.current || submittedRef.current) return;
    violationHandledRef.current = true;
    violationCountRef.current += 1;
    showSecurityAlert('Tab switching detected. Test will be submitted.');
    if (attemptId && test) {
      handleSubmit();
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        handleVisibilityViolation();
      }
    };
    const onBlur = () => {
      handleVisibilityViolation();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
    };
  }, [attemptId, test]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    stopFaceMonitoring();
    stopFullscreenEnforcement();
  };

  const startFaceMonitoring = () => {
    try {
      // Clear any prior monitors
      stopFaceMonitoring();
      if (!('FaceDetector' in window)) {
        console.warn('FaceDetector API not supported in this browser');
        return;
      }
      faceDetectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
      faceCheckIntervalRef.current = setInterval(async () => {
        try {
          if (!videoRef.current || !cameraActive || !faceDetectorRef.current) return;
          const faces = await faceDetectorRef.current.detect(videoRef.current);
          if (faces && faces.length > 1) {
            // Trigger on transition into multi-face state
            if (!multiFaceActiveRef.current) {
              multiFaceActiveRef.current = true;
              multiFaceViolationCountRef.current += 1;
              const count = multiFaceViolationCountRef.current;
              if (count < 3) {
                const remaining = 3 - count;
                lastFaceWarnRef.current = Date.now();
                showSecurityAlert(`Multiple faces detected. This is warning ${count}/3. ${remaining} more and the test will be auto-submitted.`);
              } else if (count >= 3 && !submittedRef.current) {
                showSecurityAlert('Multiple faces detected 3 times. Submitting your test now.');
                handleSubmit();
              }
            }
          } else {
            // Reset state when back to single/no face so future infractions are counted once per event
            if (multiFaceActiveRef.current) {
              multiFaceActiveRef.current = false;
            }
          }
        } catch (e) {
          // If detection fails often, stop monitoring silently
        }
      }, 3000);
    } catch (e) {
      console.warn('Failed to initialize face monitoring:', e);
    }
  };

  const stopFaceMonitoring = () => {
    if (faceCheckIntervalRef.current) {
      clearInterval(faceCheckIntervalRef.current);
      faceCheckIntervalRef.current = null;
    }
    faceDetectorRef.current = null;
  };

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      // Persist progress every tick
      saveProgress();
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && attemptId && test && !submittedRef.current) {
      handleSubmit();
    }
  }, [timeLeft, timerActive, attemptId, test]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    // Persist answers quickly
    setTimeout(saveProgress, 0);
  };

  const handleSubmit = async () => {
    if (submittedRef.current || submitting) return;
    if (!attemptId || !test) {
      console.warn("Submit blocked: attempt or test not ready");
      return;
    }
    
    submittedRef.current = true;
    setTimerActive(false);
    setSubmitting(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      let totalPoints = 0;
      
      test.questions.forEach(question => {
        if (answers[question.id] === question.correct) {
          correctAnswers++;
          totalPoints += question.points;
        }
      });
      
      const score = Math.round((totalPoints / test.totalPoints) * 100);
      const timeTaken = Math.floor((test.duration * 60 - timeLeft) / 60);
      
      // Submit results
      await testAPI.submitTestResults(attemptId, score, timeTaken);
      
      // Stop camera
      stopCamera();
      violationHandledRef.current = true;
      // Clear saved progress
      localStorage.removeItem(storageKeyRef.current);
      
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
      {/* Security Warning */}
      {showWarning && (
        <div className="fixed inset-0 bg-[#0c2543]/90 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#ffffff] p-8 rounded-xl border border-[#e1ab30] max-w-md mx-4"
          >
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-[#e1ab30] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#0c2543] mb-4">Proctored Test</h2>
              <p className="text-[#6c9d87] mb-6">
                This is a proctored test. Your camera will be monitored and copy/paste is disabled.
                <br /><br />
                <strong className="text-[#0c2543]">Rules:</strong>
                <br />• No looking away from screen
                <br />• No external help
                <br />• No switching tabs
                <br />• Camera must be on
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-[#6c9d87] text-white py-3 rounded-lg hover:bg-[#0c2543] transition"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-4">
                <button
                  onClick={async () => { await startCamera(); }}
                  className={`py-3 rounded-lg transition ${cameraReady ? "bg-[#6c9d87] text-white" : "bg-[#0e6994] text-white hover:bg-[#0c2543]"}`}
                >
                  {cameraReady ? "Camera Enabled" : "Enable Camera"}
                </button>
                <button
                  onClick={async () => { await enterFullscreen(); startFullscreenEnforcement(); setFullscreenReady(true); }}
                  className={`py-3 rounded-lg transition ${fullscreenReady ? "bg-[#6c9d87] text-white" : "bg-[#0e6994] text-white hover:bg-[#0c2543]"}`}
                >
                  {fullscreenReady ? "Fullscreen Enabled" : "Enter Fullscreen"}
                </button>
                <button
                  onClick={() => { setShowWarning(false); setTimerActive(true); }}
                  disabled={!cameraReady || !fullscreenReady}
                  className={`py-3 rounded-lg transition ${(!cameraReady || !fullscreenReady) ? "bg-[#b0cece] text-[#0c2543] cursor-not-allowed" : "bg-[#7035fd] text-white hover:bg-[#0c2543]"}`}
                >
                  Begin Test
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0c2543] border-b border-[#0e6994] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-[#b0cece] hover:text-white transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{test.title}</h1>
                <p className="text-[#b0cece] text-sm">
                  Question {currentQuestion + 1} of {test.questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Camera Status */}
              <div className="flex items-center gap-2">
                {cameraActive ? (
                  <div className="flex items-center gap-2 text-[#6c9d87]">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm">Camera On</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#e18891]">
                    <CameraOff className="w-5 h-5" />
                    <span className="text-sm">Camera Off</span>
                  </div>
                )}
                <button
                  onClick={cameraActive ? stopCamera : startCamera}
                  className="p-2 bg-[#0e6994] rounded-lg hover:bg-[#0c2543] transition"
                >
                  {cameraActive ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                </button>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 text-white">
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
            <div className="w-full bg-[#0e6994] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#6c9d87] to-[#7035fd] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 border border-[#b0cece] sticky top-32">
              <h3 className="text-[#0c2543] font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0e6994]" />
                Proctoring Camera
              </h3>
              <div className="aspect-video bg-[#b0cece] rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-[#0e6994] bg-[#b0cece]">
                    {cameraError ? (
                      <div className="text-center">
                        <CameraOff className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Camera Error</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Camera Off</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {cameraError && (
                <p className="text-[#e18891] text-xs mt-2">
                  Please allow camera access to continue
                </p>
              )}
            </div>
          </div>

          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-[#b0cece] sticky top-32">
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
          <div className="lg:col-span-2">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-8 border border-[#b0cece]"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0c2543] mb-6">
                  {currentQ.question}
                </h2>
                {currentQ.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={currentQ.imageUrl}
                      alt="Question"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="max-h-64 max-w-full rounded-lg border border-[#b0cece] object-contain"
                    />
                  </div>
                )}
                
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