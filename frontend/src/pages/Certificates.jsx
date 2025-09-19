import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Award, 
  Star, 
  Calendar,
  CheckCircle,
  Trophy,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { certificatesAPI } from "../services/api";

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const real = await certificatesAPI.getCertificates();
      setCertificates(real);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate) => {
    // In a real app, this would download the actual certificate PDF
    console.log("Downloading certificate:", certificate.certificateId);
    alert(`Downloading certificate: ${certificate.title}`);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced":
        return "text-orange-roughy bg-orange-roughy/20";
      case "Intermediate":
        return "text-golden-grass bg-golden-grass/20";
      case "Beginner":
        return "text-oxley bg-oxley/20";
      default:
        return "text-blue-zodiac/70 bg-jet-stream/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-chill mx-auto mb-4"></div>
          <p className="text-blue-zodiac">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-blue-zodiac">
      {/* Header */}
      <div className="bg-jet-stream/30 border-b border-jet-stream">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-zodiac/70 hover:text-blue-zodiac transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-blue-zodiac flex items-center gap-2">
              <Award className="w-6 h-6" />
              My Certificates
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-jet-stream/50"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-golden-grass" />
              <div>
                <p className="text-blue-zodiac/70 text-sm">Total Certificates</p>
                <p className="text-2xl font-bold text-blue-zodiac">{certificates.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-jet-stream/50"
          >
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-blue-chill" />
              <div>
                <p className="text-blue-zodiac/70 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-blue-zodiac">
                  {certificates.length > 0 ? Math.round(certificates.reduce((acc, cert) => acc + cert.score, 0) / certificates.length) : 0}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-jet-stream/50"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-oxley" />
              <div>
                <p className="text-blue-zodiac/70 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-zodiac">100%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-jet-stream/30 rounded-xl p-6 border border-jet-stream/50 hover:border-blue-chill/50 transition group"
            >
              {/* Certificate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-chill rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-zodiac font-semibold text-lg">{certificate.title}</h3>
                    <p className="text-blue-zodiac/70 text-sm">{certificate.subject}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(certificate.level)}`}>
                  {certificate.level}
                </span>
              </div>

              {/* Score Display */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-zodiac/70 text-sm">Score</span>
                  <span className="text-2xl font-bold text-oxley">{certificate.score}%</span>
                </div>
                <div className="w-full bg-jet-stream rounded-full h-2">
                  <div
                    className="bg-oxley h-2 rounded-full transition-all duration-500"
                    style={{ width: `${certificate.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-blue-zodiac/70 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Completed: {new Date(certificate.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-zodiac/70 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>ID: {certificate.certificateId}</span>
                </div>
              </div>

              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDownload(certificate)}
                className="w-full bg-blue-chill text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-zodiac transition group-hover:shadow-lg group-hover:shadow-blue-chill/25"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="w-16 h-16 text-jet-stream mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-zodiac mb-2">No Certificates Yet</h3>
            <p className="text-blue-zodiac/70 mb-6">Complete some tests to earn your first certificate!</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-chill text-white px-6 py-3 rounded-lg hover:bg-blue-zodiac transition"
            >
              Browse Tests
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}