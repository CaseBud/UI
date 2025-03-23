import React from 'react';

const AICommentPanel = ({ comments }) => {
    return (
        <div className="border-t border-slate-700/50 p-4">
            <h3 className="text-slate-200 font-medium mb-2">AI Comments</h3>
            <div className="space-y-2">
                {comments.map((comment, index) => (
                    <div 
                        key={index}
                        className="p-2 bg-slate-700/30 rounded text-sm text-slate-300"
                    >
                        {comment}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AICommentPanel;
