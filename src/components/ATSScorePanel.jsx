import { useState, useEffect } from 'react';

function ATSScorePanel({ score = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-500', lightBg: 'bg-green-50', border: 'border-green-200' };
    if (score >= 60) return { label: 'Good', color: 'text-indigo-600', bg: 'bg-indigo-500', lightBg: 'bg-indigo-50', border: 'border-indigo-200' };
    if (score >= 40) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-500', lightBg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-500', lightBg: 'bg-red-50', border: 'border-red-200' };
  };

  const status = getScoreStatus(score);

  const suggestions = [
    { text: 'Add more action verbs to describe achievements', priority: 'high' },
    { text: 'Include quantifiable metrics and results', priority: 'high' },
    { text: 'Optimize keywords for your target industry', priority: 'medium' },
    { text: 'Consider adding a skills section', priority: 'low' },
  ];

  const metrics = [
    { label: 'Keywords Match', value: Math.min(score + 5, 100), icon: '🔑' },
    { label: 'Formatting', value: Math.min(score + 10, 100), icon: '📐' },
    { label: 'Content Quality', value: Math.max(score - 5, 0), icon: '✍️' },
    { label: 'Readability', value: Math.min(score + 3, 100), icon: '👁️' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">ATS Score Analysis</h3>
              <p className="text-xs text-slate-400">Applicant Tracking System Compatibility</p>
            </div>
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${status.lightBg} ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Score Display */}
      <div className="p-6">
        <div className="flex items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#6366f1' : score >= 40 ? '#eab308' : '#ef4444'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${animatedScore * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{score}</span>
              <span className="text-xs text-slate-500">out of 100</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {metrics.map(({ label, value, icon }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.bg} transition-all duration-700`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Suggestions */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-6 flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <span className="text-sm font-medium text-slate-700">AI Suggestions ({suggestions.length})</span>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Suggestions List */}
        {showDetails && (
          <div className="mt-4 space-y-2 animate-fadeIn">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  suggestion.priority === 'high' 
                    ? 'bg-red-50 border border-red-100' 
                    : suggestion.priority === 'medium'
                    ? 'bg-yellow-50 border border-yellow-100'
                    : 'bg-slate-50 border border-slate-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  suggestion.priority === 'high'
                    ? 'bg-red-100 text-red-600'
                    : suggestion.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 flex-1">{suggestion.text}</p>
                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                  suggestion.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : suggestion.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSScorePanel;
