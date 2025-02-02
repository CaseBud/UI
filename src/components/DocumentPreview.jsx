import React from 'react';

const DocumentPreview = ({ document }) => {
  const getFileIcon = (fileType) => {
    const iconClass = "w-5 h-5";
    switch (fileType) {
      case 'pdf':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="mt-2 p-2 bg-slate-800/50 rounded-lg border border-slate-600/50">
      <div className="flex items-center space-x-3">
        <div className="text-blue-400">
          {getFileIcon(document.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">
            {document.name}
          </p>
          <p className="text-xs text-slate-400">
            {document.size ? `${(document.size / 1024).toFixed(1)} KB` : ''}
          </p>
        </div>
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default DocumentPreview;
