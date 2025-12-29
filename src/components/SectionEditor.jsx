function SectionEditor({ title, value, onChange, placeholder }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
          {value.length} characters
        </span>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter your ${title.toLowerCase()} here...`}
        className="w-full h-40 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 placeholder-slate-400 transition-all duration-200"
      />
      
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Enhance
        </button>
        <span className="text-slate-300">|</span>
        <button
          type="button"
          className="text-xs text-slate-500 hover:text-slate-700 font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default SectionEditor;
