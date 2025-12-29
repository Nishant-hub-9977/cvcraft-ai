import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/upload', label: 'Upload Resume', icon: UploadIcon, shortcut: 'Ctrl+U' },
  { path: '/templates', label: 'Templates', icon: TemplateIcon, shortcut: 'Ctrl+T' },
  { path: '/editor', label: 'Editor', icon: EditorIcon, shortcut: 'Ctrl+E' },
  { path: '/export', label: 'Export', icon: ExportIcon, shortcut: 'Ctrl+S' },
];

function UploadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function EditorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getStepNumber = (path) => {
    const steps = { '/upload': 1, '/templates': 2, '/editor': 3, '/export': 4 };
    return steps[path] || 0;
  };

  const currentStep = getStepNumber(location.pathname);

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setIsCollapsed(true)}
      />

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-slate-200"
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      } w-72 lg:w-64`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <DocumentIcon />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                CVCraft AI
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Professional Resume Builder</p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-xs font-medium text-indigo-400">{currentStep}/4 Steps</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step <= currentStep ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 mb-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Navigation</span>
          </div>
          <ul className="space-y-1 px-3">
            {navItems.map(({ path, label, icon: Icon, shortcut }, index) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => setIsCollapsed(true)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`
                  }
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    location.pathname === path ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}>
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">{label}</span>
                    <span className="block text-[10px] text-slate-500 group-hover:text-slate-400">{shortcut}</span>
                  </div>
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${
                    index + 1 < currentStep 
                      ? 'bg-green-500/20 text-green-400' 
                      : index + 1 === currentStep 
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-slate-700 text-slate-500'
                  }`}>
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-300">Quick Actions</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Upload Resume</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Ctrl+U</kbd>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">Ctrl+K</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">User</p>
              <p className="text-xs text-slate-500 truncate">Free Plan</p>
            </div>
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
