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
  const [downloading, setDownloading] = useState(false);

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

  // Load jsPDF from CDN on demand to avoid bundling dependency
  const ensureJsPDF = () => new Promise((resolve, reject) => {
    if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
    const existing = document.getElementById('jspdf-umd');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.jspdf.jsPDF));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'jspdf-umd';
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  const handleDownload = async (certificate) => {
    try {
      setDownloading(true);
      const jsPDFCtor = await ensureJsPDF();
      const doc = new jsPDFCtor({ orientation: 'landscape', unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;

      // Resolve recipient name and presentation values
      let recipientName = 'Student';
      try {
        const saved = localStorage.getItem('user');
        if (saved) {
          const u = JSON.parse(saved);
          recipientName = u?.name || u?.fullName || u?.username || recipientName;
        }
      } catch (_) {}
      const subjectLine = certificate.subject ? String(certificate.subject) : '';
      const percent = Math.min(100, Math.max(0, Math.round(Number(certificate.score) || 0)));

      // Background frame
      doc.setDrawColor(10, 102, 148);
      doc.setLineWidth(2);
      doc.roundedRect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 12, 12, 'S');

      // Header
      doc.setTextColor(12, 37, 67);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('Certificate of Achievement', pageWidth / 2, margin + 70, { align: 'center' });

      // Subtitle
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(108, 157, 135);
      doc.text('This certificate is proudly presented to', pageWidth / 2, margin + 110, { align: 'center' });

      // Recipient name on its own line
      doc.setTextColor(12, 37, 67);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(String(recipientName).toUpperCase(), pageWidth / 2, margin + 150, { align: 'center' });

      // Subject below the name
      if (subjectLine) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(112, 53, 253);
        doc.text(subjectLine, pageWidth / 2, margin + 175, { align: 'center' });
      }

      // Reason/details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(80, 96, 112);
      const details = `for successfully completing ${certificate.title} with a score of ${percent}%`;
      doc.text(details, pageWidth / 2, margin + (subjectLine ? 205 : 180), { align: 'center' });

      // Info row
      doc.setFontSize(12);
      doc.setTextColor(12, 37, 67);
      const date = new Date(certificate.completedAt).toLocaleDateString();
      const certId = certificate.certificateId || 'CERT-XXXX';
      doc.text(`Date: ${date}`, margin + 20, pageHeight - margin - 80);
      doc.text(`Certificate ID: ${certId}`, pageWidth - margin - 220, pageHeight - margin - 80);

      // Signature
      const signY = pageHeight - margin - 60;
      const signX = pageWidth / 2 - 140;
      doc.setDrawColor(112, 53, 253);
      doc.setLineWidth(1);
      doc.line(signX, signY, signX + 280, signY);
      doc.setTextColor(112, 53, 253);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Atul Kathole', signX + 140, signY - 8, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(12, 37, 67);
      doc.setFontSize(10);
      doc.text('Research and Development Head', signX + 140, signY + 16, { align: 'center' });

      // Seal/icon substitute
      doc.setDrawColor(209, 71, 25);
      doc.setFillColor(209, 71, 25);
      doc.circle(pageWidth - margin - 50, margin + 50, 24, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AES', pageWidth - margin - 50, margin + 56, { align: 'center' });

      const filename = `${certId}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF generation failed, falling back:', err);
      // Fallback: open print-friendly window to allow "Save as PDF"
      let recipientName = 'Student';
      try {
        const saved = localStorage.getItem('user');
        if (saved) {
          const u = JSON.parse(saved);
          recipientName = u?.name || u?.fullName || u?.username || recipientName;
        }
      } catch (_) {}
      const subjectLine = certificate.subject ? String(certificate.subject) : '';
      const percent = Math.min(100, Math.max(0, Math.round(Number(certificate.score) || 0)));
      const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Certificate</title>
        <style>
          body{font-family:Helvetica,Arial,sans-serif;color:#0c2543;padding:40px}
          .frame{border:2px solid #0e6694;border-radius:12px;padding:40px}
          .title{font-weight:700;font-size:28px;text-align:center;margin-top:20px}
          .sub{color:#6c9d87;text-align:center;margin-top:8px}
          .name{text-align:center;font-weight:700;font-size:22px;margin:12px 0}
          .subject{text-align:center;color:#7035fd;margin-top:2px}
          .muted{color:#506070;text-align:center}
          .row{display:flex;justify-content:space-between;margin-top:40px}
          .sign{margin-top:40px;text-align:center}
        </style></head><body>
        <div class="frame">
          <div class="title">Certificate of Achievement</div>
          <div class="sub">This certificate is proudly presented to</div>
          <div class="name">${String(recipientName).toUpperCase()}</div>
          ${subjectLine ? `<div class="subject">${subjectLine}</div>` : ''}
          <div class="muted">for successfully completing ${certificate.title} with a score of ${percent}%</div>
          <div class="row">
            <div>Date: ${new Date(certificate.completedAt).toLocaleDateString()}</div>
            <div>Certificate ID: ${certificate.certificateId || 'CERT-XXXX'}</div>
          </div>
          <div class="sign">
            <div style="border-top:1px solid #7035fd;width:280px;margin:24px auto 6px"></div>
            <div style="color:#7035fd;font-weight:700">Atul Kathole</div>
            <div style="color:#0c2543;font-size:12px">Research and Development Head</div>
          </div>
        </div>
        <script>window.print();</script>
      </body></html>`;
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    } finally {
      setDownloading(false);
    }
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
                className="w-full bg-blue-chill text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-zodiac transition group-hover:shadow-lg group-hover:shadow-blue-chill/25 disabled:opacity-60"
                disabled={downloading}
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Preparing...' : 'Download Certificate'}
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