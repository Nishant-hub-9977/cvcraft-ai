function ATSScorePanel({ score = 0 }) {
  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-500' };
    if (score >= 60) return { label: 'Good', color: 'text-indigo-600', bg: 'bg-indigo-500' };
    if (score >= 40) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-500' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-500' };
  };

  const status = getScoreStatus(score);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">ATS Score</h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.color} bg-opacity-10`}>
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#6366f1' : score >= 40 ? '#eab308' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.51} 251`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{score}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Keywords Match</span>
                <span className="font-medium text-slate-800">{Math.min(score + 5, 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${status.bg} transition-all duration-700`}
                  style={{ width: `${Math.min(score + 5, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Formatting</span>
                <span className="font-medium text-slate-800">{Math.min(score + 10, 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${status.bg} transition-all duration-700`}
                  style={{ width: `${Math.min(score + 10, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Content Quality</span>
                <span className="font-medium text-slate-800">{Math.max(score - 5, 0)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${status.bg} transition-all duration-700`}
                  style={{ width: `${Math.max(score - 5, 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ATSScorePanel;
