import React from 'react';

const DocumentPreview = ({ document }) => {
  if (!document) return null;
  
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M9 13v4"/>
            <path d="M15 13v4"/>
            <path d="M9 17h6"/>
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
            <path d="M10 9H8"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 mt-2 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors">
      {getFileIcon(document.name)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{document.name}</p>
        <p className="text-xs text-slate-400">
          {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Just uploaded'}
        </p>
      </div>
    </div>
  );
};

export default DocumentPreview;
