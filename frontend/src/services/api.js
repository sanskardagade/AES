const API_BASE_URL = 'http://localhost:5000/api';

function userHeaders() {
  try {
    const saved = localStorage.getItem('user');
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (parsed && parsed.id) return { 'X-User-Id': String(parsed.id) };
    return {};
  } catch (_) {
    return {};
  }
}

// API service for authentication
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

// API service for tests and dashboard
export const testAPI = {
  // Get available tests
  getAvailableTests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/available`, { headers: { ...userHeaders() } });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tests');
      }

      return data.tests;
    } catch (error) {
      console.error('Error fetching available tests:', error);
      throw error;
    }
  },

  // Get test with questions
  getTestWithQuestions: async (testId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}/questions`, { headers: { ...userHeaders() } });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test questions');
      }

      return data.test;
    } catch (error) {
      console.error('Error fetching test questions:', error);
      throw error;
    }
  },

  // Get completed tests
  getCompletedTests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/completed`, { headers: { ...userHeaders() } });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch completed tests');
      }

      return data.tests;
    } catch (error) {
      console.error('Error fetching completed tests:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/statistics`, { headers: { ...userHeaders() } });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      return data.statistics;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },  

  // Get user analytics snapshot
  getUserAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/analytics`, { headers: { ...userHeaders() } });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
      return data.analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Subscribe to analytics SSE stream
  subscribeAnalytics: (onData) => {
    const headers = userHeaders();
    const query = headers['X-User-Id'] ? `?uid=${encodeURIComponent(headers['X-User-Id'])}` : '';
    const source = new EventSource(`${API_BASE_URL.replace('http', 'http')}/tests/analytics/stream${query}`);
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && (payload.type === 'analytics:init' || payload.type === 'analytics:update')) {
          onData(payload.analytics);
        }
      } catch (_) {}
    };
    source.onerror = () => {
      // Let caller decide to retry
    };
    return () => source.close();
  },

  // Start a test
  startTest: async (testId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/start/${testId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...userHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start test');
      }

      return data;
    } catch (error) {
      console.error('Error starting test:', error);
      throw error;
    }
  },

  // Submit test results
  submitTestResults: async (attemptId, score, timeTaken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...userHeaders(),
        },
        body: JSON.stringify({ attemptId, score, timeTaken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit test results');
      }

      return data;
    } catch (error) {
      console.error('Error submitting test results:', error);
      throw error;
    }
  },
};

// Certificates API backed by completed tests
export const certificatesAPI = {
  getCertificates: async () => {
    const res = await fetch(`${API_BASE_URL}/tests/completed`, { headers: { ...userHeaders() } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch certificates');
    return (data.tests || []).map(t => ({
      id: t.id,
      title: t.title,
      subject: t.subject,
      score: Math.round((t.score / t.maxScore) * 100),
      completedAt: t.completedAt,
      certificateId: `${(t.subject || 'CERT').slice(0,3).toUpperCase()}-${t.id}`,
      status: 'completed',
      level: 'Intermediate',
    }));
  },
};

// API service for placement officer dashboard
export const placementAPI = {
  // Get students overview for placement officer
  getStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/placement/students`, { headers: { ...userHeaders() } });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch students');
      }

      return data.students || data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }, 
  // Stream real-time placement updates via SSE
  subscribe: (onData) => {
    const headers = userHeaders();
    const query = headers['X-User-Id'] ? `?uid=${encodeURIComponent(headers['X-User-Id'])}` : '';
    const source = new EventSource(`${API_BASE_URL}/placement/stream${query}`);
    source.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.type === 'placement:update') {
          onData(payload.data.students || []);
        }
      } catch (_) {}
    };
    source.onerror = () => {};
    return () => source.close();
  },
  getStudentDetails: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/placement/students/${userId}`, { headers: { ...userHeaders() } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load details');
    return data.student;
  },
  recommend: async (userId, note) => {
    const res = await fetch(`${API_BASE_URL}/placement/students/${userId}/recommend`, {
      method: 'POST',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to recommend student');
    return data;
  },
};

// API service for admin panel
export const adminAPI = {
  getTests: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/tests`, { headers: { ...userHeaders(), 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load tests');
    return data.tests;
  },
  createTest: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/admin/tests`, {
      method: 'POST',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create test');
    return data.test;
  },
  deleteTest: async (testId) => {
    const res = await fetch(`${API_BASE_URL}/admin/tests/${testId}`, {
      method: 'DELETE',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete test');
    return data;
  },
  updateTest: async (testId, payload) => {
    const res = await fetch(`${API_BASE_URL}/admin/tests/${testId}`, {
      method: 'PUT',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update test');
    return data.test;
  },
  getQuestions: async (testId) => {
    const res = await fetch(`${API_BASE_URL}/admin/tests/${testId}/questions`, { headers: { ...userHeaders(), 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load questions');
    return data.questions;
  },
  createQuestion: async (testId, payload) => {
    const res = await fetch(`${API_BASE_URL}/admin/tests/${testId}/questions`, {
      method: 'POST',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create question');
    return data.question;
  },
  deleteQuestion: async (questionId) => {
    const res = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
      method: 'DELETE',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete question');
    return data;
  },
  downloadQuestionsTemplate: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/questions/template`, { headers: { ...userHeaders() } });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to download template');
    }
    const blob = await res.blob();
    return blob;
  },
  uploadQuestionsExcel: async (testId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/admin/tests/${testId}/questions/upload`, {
      method: 'POST',
      headers: { ...userHeaders() },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload questions');
    return data;
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    const res = await fetch(`${API_BASE_URL}/profile`, { headers: { ...userHeaders(), 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load profile');
    return data.profile;
  },
  update: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: { ...userHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data.profile;
  },
};

export default authAPI;
