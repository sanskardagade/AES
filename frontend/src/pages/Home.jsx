"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Target,
} from "lucide-react";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ users: 0, tests: 0, success: 0 });

  const testimonials = [
    { name: "Sarah Johnson", role: "Student", text: "AES Platform helped me ace my exams with confidence!", rating: 5 },
    { name: "Dr. Michael Chen", role: "Professor", text: "The best assessment tool I've used in my 15-year career.", rating: 5 },
    { name: "Emma Davis", role: "HR Manager", text: "Streamlined our hiring process with reliable assessments.", rating: 5 },
  ];

  const features = [
    { icon: BookOpen, title: "Smart Assessments", desc: "AI-powered questions that adapt to your skill level" },
    { icon: Shield, title: "Secure Testing", desc: "Advanced proctoring and anti-cheating measures" },
    { icon: TrendingUp, title: "Real-time Analytics", desc: "Detailed performance insights and progress tracking" },
    { icon: Clock, title: "Flexible Scheduling", desc: "Take tests anytime, anywhere with our mobile platform" },
    { icon: Target, title: "Personalized Learning", desc: "Custom study paths based on your strengths and weaknesses" },
    { icon: Award, title: "Instant Certification", desc: "Get verified certificates upon successful completion" },
  ];

  useEffect(() => {
    // Animate stats counter
    const timer = setInterval(() => {
      setStats((prev) => ({
        users: Math.min(prev.users + 127, 50000),
        tests: Math.min(prev.tests + 89, 25000),
        success: Math.min(prev.success + 2, 98),
      }));
    }, 50);

    // Rotate testimonials
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(testimonialTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden text-white">

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-800/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-800/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-800/50 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full text-white/80 text-sm mb-6 animate-bounce">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            Trusted by 50,000+ students worldwide
          </div> */}

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-white">
              AES
            </span>
            <br />
            <span className="text-white">Platform</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your learning journey with AI-powered assessments, real-time analytics, and personalized study
            paths that adapt to your unique learning style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/login"
              className="group inline-flex items-center px-8 py-4 font-bold text-white bg-gray-700/80 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="group inline-flex items-center px-8 py-4 font-semibold text-white border-2 border-gray-700 rounded-full hover:bg-gray-700/60 transition-all duration-300">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stats.users.toLocaleString()}+</div>
              <div className="text-white/60 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stats.tests.toLocaleString()}+</div>
              <div className="text-white/60 text-sm">Tests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stats.success}%</div>
              <div className="text-white/60 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose AES Platform?</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the future of online assessments with cutting-edge technology and innovative features designed
            for your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-800/50 rounded-2xl p-8 hover:bg-gray-700/70 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-700"
            >
              <div className="bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">What Our Users Say</h2>

          <div className="bg-gray-800/50 rounded-3xl p-12 border border-gray-700">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>

            <blockquote className="text-2xl mb-8 italic leading-relaxed">
              "{testimonials[currentTestimonial].text}"
            </blockquote>

            <div className="text-white/80">
              <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
              <div className="text-white/60">{testimonials[currentTestimonial].role}</div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800/50 rounded-3xl p-12 border border-gray-700">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Excel?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of successful students and professionals who trust AES Platform for their assessment needs.
              Start your journey today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-10 py-4 font-bold text-white bg-gray-700 rounded-full shadow hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
                <CheckCircle className="ml-2 w-5 h-5" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center px-10 py-4 font-semibold text-white border-2 border-gray-700 rounded-full hover:bg-gray-700/60 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">AES Platform</h3>
            <p className="text-white/60 leading-relaxed">Empowering learners worldwide with innovative assessment solutions.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/status" className="hover:text-white transition-colors">System Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-white/60">&copy; 2025 AES Platform. All rights reserved. Built with ❤️ for learners everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
