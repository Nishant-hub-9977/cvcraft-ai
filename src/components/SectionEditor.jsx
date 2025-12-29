import { useState } from 'react';

/**
 * SectionEditor Component
 * 
 * A fully controlled editor component for resume sections.
 * Receives all data via props and reports changes via onChange.
 * 
 * Props:
 * - sectionKey: Identifier for the section (e.g., 'summary', 'experience')
 * - title: Display title for the section
 * - data: Current value(s) - can be string, array of strings, or array of objects
 * - onChange: Callback when data changes - receives (sectionKey, newValue)
 * - placeholder: Placeholder text for empty state
 * - icon: Optional icon component
 * - type: 'text' | 'bullets' | 'skills' - determines rendering mode
 * 
 * Internal state is UI-only (focus, hover, loading animations)
 */
function SectionEditor({ 
  sectionKey, 
  title, 
  data, 
  onChange, 
  placeholder, 
  icon,
  type = 'text', // 'text' | 'bullets' | 'skills'
  tips = [],
}) {
  // UI-only state
  const [isFocused, setIsFocused] = useState(false);

  // Handle clearing the content
  const handleClear = () => {
    if (type === 'bullets' || type === 'skills') {
      onChange(sectionKey, []);
    } else {
      onChange(sectionKey, '');
    }
  };

  // Get display value for character count
  const getCharacterCount = () => {
    if (typeof data === 'string') {
      return data.length;
    }
    if (Array.isArray(data)) {
      return data.join(' ').length;
    }
    return 0;
  };

  // Get display value for textarea
  const getTextValue = () => {
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      // For arrays, join with newlines for editing
      return data.join('\n');
    }
    return '';
  };

  // Handle text change - convert back to appropriate format
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    
    if (type === 'bullets' || type === 'skills') {
      // Convert newline-separated text to array
      const items = newValue.split('\n').filter((item) => item.trim() !== '' || newValue.endsWith('\n'));
      onChange(sectionKey, items.length > 0 ? items : [newValue]);
    } else {
      onChange(sectionKey, newValue);
    }
  };

  const characterCount = getCharacterCount();

  const getCharacterCountColor = () => {
    if (characterCount > 500) return 'text-green-600';
    if (characterCount > 200) return 'text-indigo-600';
    if (characterCount > 50) return 'text-yellow-600';
    return 'text-slate-400';
  };

  const hasContent = characterCount > 0;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
      isFocused 
        ? 'border-indigo-300 shadow-lg shadow-indigo-500/10' 
        : 'border-slate-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isFocused ? 'bg-indigo-100' : 'bg-slate-100'
          }`}>
            {icon || (
              <svg className={`w-5 h-5 transition-colors ${isFocused ? 'text-indigo-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">
              {type === 'bullets' ? 'Use new lines for bullet points' : 
               type === 'skills' ? 'Use new lines to separate skills' : 
               'Click to edit this section'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 ${getCharacterCountColor()}`}>
            {characterCount} characters
          </span>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <textarea
          value={getTextValue()}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || `Enter your ${title.toLowerCase()} here...`}
          className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white text-slate-700 placeholder-slate-400 transition-all duration-200 text-sm leading-relaxed"
        />
        {tips.length > 0 && (
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-700 mb-2">ATS tips</p>
            <ul className="space-y-1">
              {tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-slate-400 mt-[2px]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="px-2 py-1 rounded-full bg-slate-100">Live ATS feedback</span>
          {tips.length > 0 && <span className="text-amber-600">{tips.length} tip{tips.length > 1 ? 's' : ''}</span>}
        </div>

        {hasContent && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SectionEditor;
