import { useNavigate } from 'react-router-dom';

function ExportPage() {
  const navigate = useNavigate();

  const handleExportPDF = () => {
    alert('PDF export functionality coming soon!');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Export Resume</h1>
          <p className="text-slate-600 mt-2">
            Review your resume and export it as a professional PDF document.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                <h3 className="font-medium text-white">Resume Preview</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-400 rounded-full" />
                  <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <span className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
              </div>

              <div className="p-8 bg-white min-h-[600px]">
                <div className="border-b border-slate-200 pb-6 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Your Name</h2>
                  <p className="text-indigo-600 font-medium mt-1">Professional Title</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      email@example.com
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +1 (555) 123-4567
                    </span>
                  </div>
                </div>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-500 rounded" />
                    Professional Summary
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Your professional summary will appear here. This section highlights your key qualifications,
                    experience, and career goals to capture the attention of hiring managers.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-500 rounded" />
                    Work Experience
                  </h3>
                  <div className="text-sm">
                    <div className="mb-3">
                      <p className="font-medium text-slate-800">Job Title at Company Name</p>
                      <p className="text-slate-500">Jan 2022 - Present</p>
                      <p className="text-slate-600 mt-1">
                        Your work experience and accomplishments will be displayed here.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-500 rounded" />
                    Education
                  </h3>
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">Degree Name</p>
                    <p className="text-slate-500">University Name • Graduation Year</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-500 rounded" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Export Options</h3>

              <div className="space-y-3">
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as PDF
                </button>

                <button className="w-full px-4 py-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Link
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Selected Template</h3>
              <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-4">
                <div className="w-12 h-16 bg-slate-200 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-800">Professional Classic</p>
                  <p className="text-sm text-slate-500">Clean and timeless design</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-800">ATS Ready</h3>
              </div>
              <p className="text-sm text-green-700">
                Your resume is optimized for Applicant Tracking Systems and ready for submission.
              </p>
            </div>

            <button
              onClick={() => navigate('/editor')}
              className="w-full px-4 py-3 text-slate-600 font-medium hover:text-slate-800 transition-colors duration-200 flex items-center justify-center gap-2"
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
