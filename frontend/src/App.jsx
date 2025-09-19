import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./components/About";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Certificates from "./pages/Certificates";
import TestInterface from "./pages/TestInterface";
import ProctoredTest from "./pages/ProctoredTest";
import AdminPanel from "./pages/AdminPanel";
import PlacementOfficer from "./pages/PlacementOfficer";
import AdminLogin from "./pages/AdminLogin";
import Instructions from "./pages/Instructions";
import TestConsole from "./pages/TestConsole";
import Results from "./pages/Results";
import Features from "./components/Features";
import Pricing from "./pages/Pricing";
import Security from "./pages/Security";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/Contact";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import SystemStatus from "./pages/SystemStatus";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* //<Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/test/:testId" element={<ProctoredTest />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/placement-officer" element={<PlacementOfficer />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/security" element={<Security />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/test/:attemptId/instructions" element={<Instructions />} />
          <Route path="/test/:attemptId" element={<TestConsole />} />
          <Route path="/test/:attemptId/results" element={<Results />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
