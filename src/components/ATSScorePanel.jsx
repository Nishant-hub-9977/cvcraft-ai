import { useEffect, useMemo, useState } from 'react';
import { useResume } from '../app/ResumeContext';

function ATSScorePanel() {
  const { atsBreakdown } = useResume();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const score = atsBreakdown?.totalScore || 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const status = useMemo(() => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-500', lightBg: 'bg-green-50' };
    if (score >= 65) return { label: 'Ready', color: 'text-indigo-600', bg: 'bg-indigo-500', lightBg: 'bg-indigo-50' };
    if (score >= 45) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-500', lightBg: 'bg-amber-50' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-500', lightBg: 'bg-red-50' };
  }, [score]);

  const categories = atsBreakdown?.categories || {};
  const categoryMeta = [
    { key: 'keywords', label: 'Keywords & Skills', weight: 35 },
    { key: 'completeness', label: 'Section Completeness', weight: 25 },
    { key: 'experience', label: 'Experience Quality', weight: 20 },
    { key: 'formatting', label: 'Formatting & Structure', weight: 20 },
  ];

  const topGaps = atsBreakdown?.improvementAreas?.slice(0, 5) || [];

  const explanations = useMemo(() => {
    if (!atsBreakdown) return [];
    const positives = atsBreakdown.formattingSignals.positive || [];
    const warnings = atsBreakdown.formattingSignals.warnings || [];
    const keywordMatches = atsBreakdown.keywordCoverage.matchedSkills?.length || 0;
    return [
      `${keywordMatches} listed skills appear in your content.`,
      `Section coverage: ${categories.completeness || 0}/25 points.`,
      warnings.length ? warnings[0] : 'Structure looks consistent.',
      positives[0] || 'Contact and summary look balanced.',
    ];
  }, [atsBreakdown, categories.completeness]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">ATS Score</h3>
              <p className="text-xs text-slate-400">Live, deterministic scoring</p>
            </div>
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${status.lightBg} ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={score >= 80 ? '#22c55e' : score >= 65 ? '#6366f1' : score >= 45 ? '#f59e0b' : '#ef4444'}
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

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-[240px]">
            {categoryMeta.map(({ key, label, weight }) => (
              <div key={key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-600">{label}</p>
                  <span className="text-[11px] text-slate-500">{weight} pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`${status.bg} h-full transition-all duration-700`}
                      style={{ width: `${Math.min((categories[key] || 0) / weight * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{categories[key] || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Top Missing Signals</p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              type="button"
            >
              {showDetails ? 'Hide why' : 'Why this score?'}
              <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {topGaps.length === 0 && (
              <p className="text-xs text-slate-500">No critical gaps detected. Fine-tune keywords for the target role.</p>
            )}
            {topGaps.map((gap, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-slate-400 mt-[2px]">•</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
          {showDetails && (
            <div className="mt-4 border-t border-slate-200 pt-3 space-y-2">
              <p className="text-xs font-semibold text-slate-600">Why this score</p>
              {explanations.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400 mt-[2px]">–</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ATSScorePanel;
