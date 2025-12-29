import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UploadPage from '../pages/UploadPage';
import TemplatesPage from '../pages/TemplatesPage';
import EditorPage from '../pages/EditorPage';
import ExportPage from '../pages/ExportPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 ml-64">
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
  );
}

export default App;
