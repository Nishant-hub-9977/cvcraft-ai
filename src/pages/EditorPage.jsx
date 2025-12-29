import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../app/ResumeContext';
import SectionEditor from '../components/SectionEditor';
import ATSScorePanel from '../components/ATSScorePanel';
import { generateId } from '../app/resumeSchema';

/**
 * EditorPage Component
 * 
 * Main resume editing interface that reads/writes from centralized ResumeContext.
 * NO local resume state - all data flows through context.
 * 
 * Data Flow:
 * - Reads: resume data from useResume() hook
 * - Writes: updateField() for text sections, updateSection() for arrays
 */

// Section icon components
const sectionIcons = {
  summary: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  experience: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  education: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  skills: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

// Section configuration - maps to resume schema
const sectionConfig = [
  {
    key: 'summary',
    title: 'Professional Summary',
    type: 'text',
    placeholder: 'Write a compelling 2-3 sentence summary highlighting your key qualifications, years of experience, and career goals. Focus on what makes you unique...',
  },
  {
    key: 'experience',
    title: 'Work Experience',
    type: 'bullets',
    placeholder: 'List your work experience with company names, positions, dates, and key accomplishments. Use bullet points and action verbs (Led, Developed, Managed)...',
  },
  {
    key: 'education',
    title: 'Education',
    type: 'bullets',
    placeholder: 'Include your degrees, institutions, graduation dates, and relevant coursework, certifications, or academic honors...',
  },
  {
    key: 'skills',
    title: 'Skills',
    type: 'skills',
    placeholder: 'List your technical skills, soft skills, tools, and technologies. Put each skill on a new line...',
  },
];

function EditorPage() {
  const navigate = useNavigate();
  
  // Get resume state and actions from context
  const { resume, updateField, updateSection, atsBreakdown, getSectionTips } = useResume();
  
  // UI-only local state
  const [activeSection, setActiveSection] = useState('summary');

  const parseExperienceText = (text, current = []) => {
    const blocks = text.split(/\n\s*\n/).filter((b) => b.trim().length);
    if (!blocks.length && text.trim().length) {
      blocks.push(text);
    }
    return (blocks.length ? blocks : ['']).map((block, idx) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      const header = lines.shift() || 'Experience';
      let role = header;
      let company = '';
      if (header.includes(' at ')) {
        const parts = header.split(' at ');
        role = parts[0];
        company = parts.slice(1).join(' at ');
      }
      const bullets = lines
        .map((line) => line.replace(/^[-•]\s*/, '').trim())
        .filter((line) => line.length);
      const currentItem = current[idx] || {};
      return {
        id: currentItem.id || generateId('exp'),
        role: role || currentItem.role || 'Role',
        company: company || currentItem.company || 'Company',
        startDate: currentItem.startDate || '',
        endDate: currentItem.endDate || '',
        bullets: bullets.length ? bullets : currentItem.bullets || ['Add measurable bullet points.'],
      };
    });
  };

  const parseEducationText = (text, current = []) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length && text.trim().length) {
      lines.push(text.trim());
    }
    return (lines.length ? lines : ['']).map((line, idx) => {
      const parts = line.split('-').map((p) => p.trim());
      const degree = parts[0] || 'Degree';
      const institution = parts[1] || parts[0] || 'Institution';
      const currentItem = current[idx] || {};
      return {
        id: currentItem.id || generateId('edu'),
        institution,
        degree,
        startYear: currentItem.startYear || '',
        endYear: currentItem.endYear || '',
        gpa: currentItem.gpa || '',
        highlights: currentItem.highlights || [],
      };
    });
  };

  /**
   * Handle section change from SectionEditor
   * Routes to appropriate update method based on section type
   */
  const handleSectionChange = (sectionKey, value) => {
    if (sectionKey === 'summary') {
      // Summary is a string field
      updateField('summary', value);
    } else if (sectionKey === 'skills') {
      // Skills is an array of strings
      updateSection('skills', Array.isArray(value) ? value : [value]);
    } else if (sectionKey === 'experience') {
      const parsed = parseExperienceText(Array.isArray(value) ? value.join('\n') : value, resume.experience);
      updateSection('experience', parsed);
      updateField('_experienceText', Array.isArray(value) ? value.join('\n') : value);
    } else if (sectionKey === 'education') {
      const parsed = parseEducationText(Array.isArray(value) ? value.join('\n') : value, resume.education);
      updateSection('education', parsed);
      updateField('_educationText', Array.isArray(value) ? value.join('\n') : value);
    }
  };

  /**
   * Get section data for SectionEditor
   * Converts resume schema data to editor-friendly format
   */
  const getSectionData = (sectionKey) => {
    switch (sectionKey) {
      case 'summary':
        return resume.summary || '';
      
      case 'skills':
        return resume.skills || [];
      
      case 'experience':
        // Convert experience array to editable text format
        if (resume._experienceText) {
          return resume._experienceText;
        }
        return resume.experience
          .map((exp) => {
            const dateRange = exp.endDate 
              ? `${exp.startDate} - ${exp.endDate}` 
              : `${exp.startDate} - Present`;
            const header = `${exp.role} at ${exp.company} (${dateRange})`;
            const bullets = exp.bullets.map((b) => `• ${b}`).join('\n');
            return `${header}\n${bullets}`;
          })
          .join('\n\n');
      
      case 'education':
        // Convert education array to editable text format
        if (resume._educationText) {
          return resume._educationText;
        }
        return resume.education
          .map((edu) => {
            const dateRange = `${edu.startYear} - ${edu.endYear}`;
            return `${edu.degree} - ${edu.institution} (${dateRange})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`;
          })
          .join('\n');
      
      default:
        return '';
    }
  };

  /**
   * Calculate completion based on actual resume data
   */
  const completionStats = useMemo(() => {
    let completed = 0;
    const total = 4;

    // Check summary
    if (resume.summary && resume.summary.length > 20) completed++;
    
    // Check experience
    if (resume.experience && resume.experience.length > 0) completed++;
    
    // Check education  
    if (resume.education && resume.education.length > 0) completed++;
    
    // Check skills
    if (resume.skills && resume.skills.length > 0) completed++;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  }, [resume]);

  const handlePreviewExport = () => {
    navigate('/export');
  };

  /**
   * Check if section has meaningful content
   */
  const sectionHasContent = (key) => {
    const data = getSectionData(key);
    if (typeof data === 'string') {
      return data.length > 20;
    }
    if (Array.isArray(data)) {
      return data.length > 0 && data.some((item) => item.length > 0);
    }
    return false;
  };

  const sectionNeedsAttention = (key) => {
    const missing = atsBreakdown?.sectionCompleteness?.missingSections || [];
    return missing.includes(key) || (getSectionTips(key)?.length > 0 && sectionHasContent(key));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            <span className="text-indigo-600 font-medium">Editor</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Your Resume</h1>
              <p className="text-slate-600">
                Customize each section of your resume. The live ATS engine keeps your content aligned and scorable.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Completion Progress */}
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${completionStats.percentage * 2.51} 251`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-800">{completionStats.percentage}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Completion</p>
                    <p className="text-xs text-slate-500">{completionStats.completed}/{completionStats.total} sections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Editors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Quick Nav */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {sectionConfig.map(({ key, title }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeSection === key
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : sectionNeedsAttention(key)
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : sectionHasContent(key)
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sectionIcons[key]}
                    {title.split(' ')[0]}
                    {sectionHasContent(key) && activeSection !== key && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Editors */}
            {sectionConfig.map(({ key, title, placeholder, type }) => (
              <div
                key={key}
                className={`transition-all duration-300 ${
                  activeSection === key ? 'ring-2 ring-indigo-500/20 rounded-2xl' : ''
                }`}
              >
                <SectionEditor
                  sectionKey={key}
                  title={title}
                  data={getSectionData(key)}
                  onChange={handleSectionChange}
                  placeholder={placeholder}
                  icon={sectionIcons[key]}
                  type={type}
                  tips={getSectionTips(key)}
                />
              </div>
            ))}

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-800">Auto-save enabled</p>
                  <p className="text-sm text-slate-500">Your changes are saved automatically</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/templates')}
                  className="px-4 py-2.5 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handlePreviewExport}
                  className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  Preview & Export
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - ATS Panel */}
          <div className="space-y-6">
            <ATSScorePanel />

            {/* Dynamic Tips Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">ATS Improvement Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                {(atsBreakdown?.improvementAreas || ['No major gaps detected.']).slice(0, 6).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">AI Enhance</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl+E</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Save</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Preview</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl+P</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
