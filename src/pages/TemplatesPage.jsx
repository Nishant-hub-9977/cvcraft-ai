import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard';

const templates = [
  { id: 1, name: 'Professional Classic', previewImage: null },
  { id: 2, name: 'Modern Minimal', previewImage: null },
  { id: 3, name: 'Creative Bold', previewImage: null },
  { id: 4, name: 'Executive Elite', previewImage: null },
];

function TemplatesPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      navigate('/editor');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Choose a Template</h1>
          <p className="text-slate-600 mt-2">
            Select a professionally designed template that best represents your personal brand.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              previewImage={template.previewImage}
              isSelected={selectedTemplate === template.id}
              onClick={() => handleSelectTemplate(template.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-6 border border-slate-200">
          <div>
            {selectedTemplate ? (
              <p className="text-slate-700">
                Selected: <span className="font-semibold text-indigo-600">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </span>
              </p>
            ) : (
              <p className="text-slate-500">No template selected</p>
            )}
          </div>

          <button
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
              selectedTemplate
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Use Selected Template
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Pro Tip</h3>
              <p className="text-white/80">
                Choose a template that matches your industry. Creative roles benefit from bold designs, 
                while corporate positions favor classic layouts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatesPage;
