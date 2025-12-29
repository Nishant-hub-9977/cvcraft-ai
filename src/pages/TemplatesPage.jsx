import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard';

const templates = [
  { id: 1, name: 'Professional Classic', description: 'Clean, timeless design for any industry', previewImage: null, tags: ['popular', 'Corporate', 'ATS-Friendly'] },
  { id: 2, name: 'Modern Minimal', description: 'Sleek and contemporary look', previewImage: null, tags: ['Tech', 'Startup'] },
  { id: 3, name: 'Creative Bold', description: 'Stand out with a unique design', previewImage: null, tags: ['Design', 'Marketing'] },
  { id: 4, name: 'Executive Elite', description: 'Premium template for senior roles', previewImage: null, tags: ['popular', 'Executive', 'Leadership'] },
  { id: 5, name: 'Tech Innovator', description: 'Perfect for software & tech roles', previewImage: null, tags: ['Tech', 'Engineering'] },
  { id: 6, name: 'Academic Scholar', description: 'Ideal for research & education', previewImage: null, tags: ['Academic', 'Research'] },
];

const categories = ['All', 'Popular', 'Corporate', 'Tech', 'Creative', 'Academic'];

function TemplatesPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      navigate('/editor');
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === 'All' || 
      template.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase()) ||
      (activeCategory === 'Popular' && template.tags.includes('popular'));
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <span className="text-indigo-600 font-medium">Templates</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Choose a Template</h1>
              <p className="text-slate-600 max-w-xl">
                Select a professionally designed template that best represents your personal brand and industry.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 text-sm"
              />
            </div>
          </div>
        </header>

        {/* Category Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              description={template.description}
              previewImage={template.previewImage}
              isSelected={selectedTemplate === template.id}
              onClick={() => handleSelectTemplate(template.id)}
              tags={template.tags}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No templates found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Selection Bar */}
        <div className="sticky bottom-6 mt-8">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4">
              {selectedTemplate ? (
                <>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Selected template</p>
                    <p className="font-semibold text-slate-800">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">No template selected</p>
                    <p className="font-medium text-slate-600">Click on a template to select it</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/upload')}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back
              </button>
              <button
                onClick={handleUseTemplate}
                disabled={!selectedTemplate}
                className={`group px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  selectedTemplate
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Use This Template
                <svg className={`w-5 h-5 transition-transform ${selectedTemplate ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Pro Tip Card */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
              <p className="text-white/90 leading-relaxed">
                Choose a template that matches your industry. Creative roles benefit from bold designs, 
                while corporate positions favor clean, classic layouts. All our templates are ATS-optimized!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatesPage;
