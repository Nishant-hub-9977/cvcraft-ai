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
    navigate('/editor');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Upload Resume</h1>
          <p className="text-slate-600 mt-2">
            Upload your existing resume to get started. We'll analyze it and provide ATS compatibility insights.
          </p>
        </header>

        <div className="space-y-6">
          <UploadZone onFileSelect={handleFileSelect} />

          {showScore && (
            <div className="animate-fade-in">
              <ATSScorePanel score={72} />
            </div>
          )}

          {uploadedFile && (
            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/30"
              >
                Continue to Editor
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">ATS Optimized</h3>
            <p className="text-sm text-slate-600">Our AI ensures your resume passes through applicant tracking systems.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-600">Get intelligent suggestions to improve your resume content.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Modern Templates</h3>
            <p className="text-sm text-slate-600">Choose from professionally designed templates that stand out.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
