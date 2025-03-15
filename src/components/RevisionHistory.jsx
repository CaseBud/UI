import React from 'react';

const RevisionHistory = ({ revisions, onClose, onRestore }) => {
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-semibold text-white">Revision History</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-white rounded-full"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {revisions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400">No revision history available yet.</p>
                            <p className="text-slate-500 text-sm mt-2">
                                Revisions are created automatically when you save changes.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {revisions.map((revision, index) => (
                                <div
                                    key={revision.id}
                                    className="p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-white font-medium">
                                                {revision.title || 'Untitled Document'}
                                                {index === 0 && (
                                                    <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                {formatDate(revision.timestamp)} by {revision.user}
                                            </p>
                                        </div>
                                        {index > 0 && (
                                            <button
                                                onClick={() => onRestore(revision)}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                                            >
                                                Restore
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="mt-2 text-xs text-slate-500">
                                        {revision.content.length > 100
                                            ? `${revision.content.substring(0, 100).replace(/<[^>]*>/g, '')}...`
                                            : revision.content.replace(/<[^>]*>/g, '')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevisionHistory; 