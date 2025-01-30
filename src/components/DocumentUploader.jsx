import React, { useState, useRef } from 'react';
import { documentsApi } from '../utils/api';
import Notification from './Notification';

const DocumentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h12.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V7L15.5 2z"/>
    <path d="M15 2v5h5"/>
    <path d="M10 13h8"/>
    <path d="M10 17h8"/>
    <path d="M10 9h2"/>
  </svg>
);

const UploadAnimation = ({ progress }) => (
  <div className="relative w-5 h-5">
    <svg className="absolute inset-0 animate-spin" viewBox="0 0 24 24">
      <circle 
        className="opacity-25" 
        cx="12" cy="12" r="10" 
        stroke="currentColor" 
        strokeWidth="4"
        fill="none"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
      {progress}%
    </span>
  </div>
);

const DocumentUploader = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // File size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // File type validation
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExt)) {
        throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      }

      setUploadProgress(50);
      const response = await documentsApi.uploadDocument(file, file.name);
      setUploadProgress(100);
      
      onUploadComplete?.(response);
      showNotification('Document uploaded successfully', 'success');
      
      event.target.value = '';
      
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to upload document:', error);
      showNotification(error.message || 'Failed to upload document. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-md text-slate-400 hover:text-white transition-colors"
          title="Click to upload a document"
        >
          {isUploading ? <UploadAnimation progress={uploadProgress} /> : <DocumentIcon />}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />

        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Upload document
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default DocumentUploader;
