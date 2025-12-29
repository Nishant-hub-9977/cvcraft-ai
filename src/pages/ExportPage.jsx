import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../app/ResumeContext';

/**
 * ExportPage Component
 * 
 * Resume preview and export interface.
 * Reads ALL data from ResumeContext - NO mock data.
 * 
 * Features:
 * - Live resume preview with real data
 * - Export format selection (PDF export placeholder for future)
 * - ATS score display
 * - Template indicator
 */

function ExportPage() {
  const navigate = useNavigate();
  const { resume } = useResume();
  
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Extract data from resume context
  const { basics, summary, experience, education, skills, projects, metadata } = resume;

  /**
   * Calculate ATS score based on resume completeness
   */
  const atsScore = useMemo(() => {
    let score = 20;

    if (summary && summary.length > 50) score += 10;
    if (summary && summary.length > 150) score += 5;
    if (summary && summary.length > 300) score += 5;

    if (experience && experience.length > 0) {
      score += 15;
      const totalBullets = experience.reduce((acc, exp) => acc + exp.bullets.length, 0);
      if (totalBullets >= 5) score += 10;
    }

    if (education && education.length > 0) score += 10;

    if (skills) {
      if (skills.length >= 5) score += 10;
      if (skills.length >= 10) score += 5;
    }

    if (basics) {
      if (basics.fullName) score += 2;
      if (basics.email) score += 2;
      if (basics.phone) score += 2;
      if (basics.linkedin) score += 2;
    }

    return Math.min(score, 95);
  }, [resume]);

  /**
   * Handle export action (placeholder for future PDF generation)
   */
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('PDF export functionality coming soon! Your resume will be downloaded as a professional PDF.');
    }, 1500);
  };

  /**
   * Format date range for display
   */
  const formatDateRange = (startDate, endDate) => {
    const formatDate = (date) => {
      if (!date) return '';
      // Handle YYYY-MM format
      const parts = date.split('-');
      if (parts.length >= 2) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
      }
      return date;
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  /**
   * Get initials from full name
   */
  const getInitials = (name) => {
    if (!name) return 'CV';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const exportFormats = [
    { id: 'pdf', name: 'PDF Document', icon: '📄', description: 'Best for sharing and printing' },
    { id: 'docx', name: 'Word Document', icon: '📝', description: 'Editable in Microsoft Word' },
    { id: 'txt', name: 'Plain Text', icon: '📋', description: 'ATS-friendly format' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-6 py-8">
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
            <span className="text-indigo-600 font-medium">Export</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Export Your Resume</h1>
              <p className="text-slate-600 max-w-xl">
                Review your resume and export it as a professional document ready for job applications.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ready to Export
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-red-400 rounded-full" />
                    <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <span className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <h3 className="font-medium text-white">Resume Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Resume Content - Reading from Context */}
              <div className="p-8 bg-white min-h-[700px]">
                {/* Header Section */}
                <div className="border-b border-slate-200 pb-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">
                        {basics?.fullName || 'Your Name'}
                      </h2>
                      <p className="text-lg text-indigo-600 font-medium mt-1">
                        {basics?.headline || 'Your Professional Title'}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(basics?.fullName)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                    {basics?.email && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {basics.email}
                      </span>
                    )}
                    {basics?.phone && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {basics.phone}
                      </span>
                    )}
                    {basics?.location && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {basics.location}
                      </span>
                    )}
                    {basics?.linkedin && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {basics.linkedin}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {summary && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                      Professional Summary
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {summary}
                    </p>
                  </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-slate-200 pl-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-800">{exp.role}</p>
                              <p className="text-indigo-600 text-sm font-medium">{exp.company}</p>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {formatDateRange(exp.startDate, exp.endDate)}
                            </span>
                          </div>
                          {exp.bullets && exp.bullets.length > 0 && (
                            <ul className="mt-2 text-sm text-slate-600 space-y-1">
                              {exp.bullets.map((bullet, idx) => (
                                <li key={idx}>• {bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                      Education
                    </h3>
                    {education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-800">{edu.degree}</p>
                          <p className="text-sm text-slate-500">
                            {edu.institution}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {edu.startYear} - {edu.endYear}
                        </span>
                      </div>
                    ))}
                  </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                      Projects
                    </h3>
                    <div className="space-y-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="border-l-2 border-slate-200 pl-4">
                          <p className="font-semibold text-slate-800">{proj.name}</p>
                          <p className="text-sm text-slate-500 mt-1">{proj.description}</p>
                          {proj.bullets && proj.bullets.length > 0 && (
                            <ul className="mt-2 text-sm text-slate-600 space-y-1">
                              {proj.bullets.map((bullet, idx) => (
                                <li key={idx}>• {bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Export Options */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Export Format</h3>
              <div className="space-y-3">
                {exportFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setExportFormat(format.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      exportFormat === format.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-2xl">{format.icon}</span>
                    <div className="text-left flex-1">
                      <p className="font-medium text-slate-800">{format.name}</p>
                      <p className="text-xs text-slate-500">{format.description}</p>
                    </div>
                    {exportFormat === format.id && (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full mt-6 px-4 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isExporting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </>
                )}
              </button>

              <button className="w-full mt-3 px-4 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Link
              </button>
            </div>

            {/* Selected Template */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4">Selected Template</h3>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-18 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    {metadata?.templateId === 'professional-classic' ? 'Professional Classic' : metadata?.templateId || 'Default'}
                  </p>
                  <p className="text-sm text-slate-500">Clean and timeless design</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/templates')}
                className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Change Template
              </button>
            </div>

            {/* ATS Ready Badge */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">ATS Verified</h3>
                  <p className="text-sm text-green-600">Score: {atsScore}/100</p>
                </div>
              </div>
              <p className="text-sm text-green-700">
                {atsScore >= 80
                  ? 'Your resume is well-optimized for Applicant Tracking Systems and ready for submission.'
                  : atsScore >= 60
                  ? 'Your resume is fairly optimized. Consider adding more details to improve your score.'
                  : 'Add more content to your resume to improve ATS compatibility.'}
              </p>
            </div>

            {/* Last Updated */}
            {metadata?.lastUpdated && (
              <div className="text-center text-xs text-slate-400">
                Last updated: {new Date(metadata.lastUpdated).toLocaleString()}
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => navigate('/editor')}
              className="w-full px-4 py-3 text-slate-600 font-medium hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportPage;
