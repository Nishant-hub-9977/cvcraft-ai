import { useState, useCallback } from 'react';

function UploadZone({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (validTypes.includes(file.type) || validExtensions.includes(fileExtension)) {
      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setSelectedFile(file);
            if (onFileSelect) {
              onFileSelect(file);
            }
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } else {
      alert('Please upload a PDF or DOCX file only.');
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setUploadProgress(0);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {/* Main Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="w-20 h-20 relative">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${uploadProgress * 2.51} 251`}
                    className="transition-all duration-200"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">{uploadProgress}%</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Uploading...</p>
                <p className="text-sm text-slate-500 mt-1">Please wait while we process your file</p>
              </div>
            </>
          ) : selectedFile ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">{selectedFile.name}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                </p>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Choose different file
              </button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-800">
                  Drag and drop your resume here
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  or click to browse files
                </p>
              </div>
              <button
                type="button"
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25"
              >
                Browse Files
              </button>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supported: PDF, DOCX
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Max size: 10MB
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Options */}
      {!selectedFile && !isUploading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Upload Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Start from Scratch</p>
                <p className="text-xs text-slate-500">Build with guided editor</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Google Drive</p>
                <p className="text-xs text-slate-500">Import from cloud</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Dropbox</p>
                <p className="text-xs text-slate-500">Import from cloud</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadZone;
