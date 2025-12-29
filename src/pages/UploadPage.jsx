import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import ATSScorePanel from '../components/ATSScorePanel';

function UploadPage() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showScore, setShowScore] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    if (file) {
      setTimeout(() => setShowScore(true), 500);
    } else {
      setShowScore(false);
    }
  };

  const handleContinue = () => {
    navigate('/templates');
  };

  const sampleTemplates = [
    { name: 'Modern Professional', icon: '📄' },
    { name: 'Classic Executive', icon: '📋' },
    { name: 'Creative Designer', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-indigo-600 font-medium">Upload Resume</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Resume Upload & Analysis</h1>
              <p className="text-slate-600 max-w-xl">
                Upload your PDF resume for intelligent parsing and analysis. Our AI will evaluate ATS compatibility and provide actionable suggestions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Upload Your Resume</h2>
                  <p className="text-sm text-slate-500">Start by uploading your existing resume</p>
                </div>
              </div>
              
              <UploadZone onFileSelect={handleFileSelect} />
            </div>

            {/* ATS Score Panel */}
            {showScore && (
              <div className="animate-slideUp">
                <ATSScorePanel score={72} />
              </div>
            )}

            {/* Continue Button */}
            {uploadedFile && (
              <div className="flex justify-end animate-fadeIn">
                <button
                  onClick={handleContinue}
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
                >
                  Continue to Templates
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sample Templates Quick Access */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Sample Templates</h3>
              <div className="space-y-3">
                {sampleTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => navigate('/templates')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{template.name}</span>
                    <svg className="w-4 h-4 text-slate-400 ml-auto group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Need Help?</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Our AI-powered parser supports PDF files up to 10MB. For best results, use a well-formatted resume.
              </p>
              <button className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Guide
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">ATS Optimized</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Our AI ensures your resume passes through applicant tracking systems with flying colors.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Get intelligent suggestions to improve your resume content and increase your chances.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Modern Templates</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Choose from professionally designed templates that make your resume stand out.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
