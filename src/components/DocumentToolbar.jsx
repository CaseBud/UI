import React, { useState } from 'react';

const DocumentToolbar = ({ onSave, onExport, onViewHistory, isSaving }) => {
    const [showExportOptions, setShowExportOptions] = useState(false);

    return (
        <div className="flex items-center space-x-2">
            {/* Save Button */}
            <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Save Document"
            >
                {isSaving ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Saving...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        <span className="hidden sm:inline">Save</span>
                    </>
                )}
            </button>

            {/* Export Button with Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="flex items-center gap-1.5 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Export Document"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span className="hidden sm:inline">Export</span>
                </button>

                {showExportOptions && (
                    <div className="absolute right-0 mt-1 w-40 bg-slate-800 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-sm z-10">
                        <div className="p-1">
                            <button
                                onClick={() => {
                                    onExport('txt');
                                    setShowExportOptions(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md"
                            >
                                Plain Text (.txt)
                            </button>
                            <button
                                onClick={() => {
                                    onExport('html');
                                    setShowExportOptions(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md"
                            >
                                HTML (.html)
                            </button>
                            <div className="border-t border-slate-700/50 my-1"></div>
                            <div className="px-3 py-2 text-xs text-slate-500">
                                More formats coming soon
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Revision History Button */}
            <button
                onClick={onViewHistory}
                className="flex items-center gap-1.5 p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="View Revision History"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="hidden sm:inline">History</span>
            </button>
        </div>
    );
};

export default DocumentToolbar; 