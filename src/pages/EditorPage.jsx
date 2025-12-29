import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionEditor from '../components/SectionEditor';

const initialSections = {
  summary: '',
  experience: '',
  education: '',
  skills: '',
};

function EditorPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState(initialSections);

  const handleSectionChange = (sectionKey, value) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  const handlePreviewExport = () => {
    navigate('/export');
  };

  const sectionConfig = [
    {
      key: 'summary',
      title: 'Professional Summary',
      placeholder: 'Write a compelling 2-3 sentence summary highlighting your key qualifications and career goals...',
    },
    {
      key: 'experience',
      title: 'Work Experience',
      placeholder: 'List your work experience with company names, positions, dates, and key accomplishments...',
    },
    {
      key: 'education',
      title: 'Education',
      placeholder: 'Include your degrees, institutions, graduation dates, and relevant coursework or honors...',
    },
    {
      key: 'skills',
      title: 'Skills',
      placeholder: 'List your technical and soft skills, separated by commas. Include proficiency levels if relevant...',
    },
  ];

  const completedSections = Object.values(sections).filter((s) => s.length > 20).length;
  const totalSections = Object.keys(sections).length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Edit Resume</h1>
              <p className="text-slate-600 mt-2">
                Customize each section of your resume. Our AI will help optimize your content.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Completion</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-lg font-semibold text-indigo-600">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {sectionConfig.map(({ key, title, placeholder }) => (
            <SectionEditor
              key={key}
              title={title}
              value={sections[key]}
              onChange={(value) => handleSectionChange(key, value)}
              placeholder={placeholder}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-800">Auto-save enabled</p>
              <p className="text-sm text-slate-500">Your changes are saved automatically</p>
            </div>
          </div>

          <button
            onClick={handlePreviewExport}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/30"
          >
            Preview & Export
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
