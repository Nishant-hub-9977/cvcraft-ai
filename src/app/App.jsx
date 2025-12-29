import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './ResumeContext';
import Sidebar from '../components/Sidebar';
import UploadPage from '../pages/UploadPage';
import TemplatesPage from '../pages/TemplatesPage';
import EditorPage from '../pages/EditorPage';
import ExportPage from '../pages/ExportPage';

/**
 * App Component
 * 
 * Root component that wraps the entire application with:
 * - ResumeProvider: Centralized resume state management
 * - BrowserRouter: Client-side routing
 * - Sidebar + Main layout structure
 */
function App() {
  return (
    <ResumeProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 lg:ml-64 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Navigate to="/upload" replace />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/export" element={<ExportPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ResumeProvider>
  );
}

export default App;
