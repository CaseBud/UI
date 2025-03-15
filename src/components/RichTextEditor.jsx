import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const RichTextEditor = forwardRef(({ content, onChange, onSelect }, ref) => {
    const editorRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [editorState, setEditorState] = useState({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        heading: null, // h1, h2, h3, etc.
        list: null // ul, ol
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        focus: () => {
            editorRef.current?.focus();
        },
        getContent: () => {
            return editorRef.current?.innerHTML || '';
        },
        setContent: (html) => {
            if (editorRef.current) {
                editorRef.current.innerHTML = html;
                handleContentChange();
            }
        }
    }));

    useEffect(() => {
        if (editorRef.current) {
            setIsEditorReady(true);
            
            // Initialize with content if provided
            if (content && editorRef.current.innerHTML !== content) {
                editorRef.current.innerHTML = content;
            }
        }
    }, []);

    // Update content when prop changes (e.g., when restoring a revision)
    useEffect(() => {
        if (isEditorReady && editorRef.current && content !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = content;
        }
    }, [content, isEditorReady]);

    const handleContentChange = () => {
        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString();
            
            if (selectedText && onSelect) {
                onSelect(selectedText, {
                    start: getTextOffset(editorRef.current, range.startContainer, range.startOffset),
                    end: getTextOffset(editorRef.current, range.endContainer, range.endOffset)
                });
            }
            
            // Update formatting state based on current selection
            updateFormattingState();
        }
    };

    // Helper function to get text offset in the editor
    const getTextOffset = (root, node, offset) => {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let totalOffset = 0;
        let currentNode;
        
        while ((currentNode = walker.nextNode())) {
            if (currentNode === node) {
                return totalOffset + offset;
            }
            totalOffset += currentNode.nodeValue.length;
        }
        
        return totalOffset;
    };

    const updateFormattingState = () => {
        setEditorState({
            isBold: document.queryCommandState('bold'),
            isItalic: document.queryCommandState('italic'),
            isUnderline: document.queryCommandState('underline'),
            heading: document.queryCommandValue('formatBlock'),
            list: document.queryCommandState('insertUnorderedList') 
                ? 'ul' 
                : document.queryCommandState('insertOrderedList') 
                    ? 'ol' 
                    : null
        });
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        handleContentChange();
        updateFormattingState();
        editorRef.current?.focus();
    };

    const formatText = (format) => {
        switch (format) {
            case 'bold':
                execCommand('bold');
                break;
            case 'italic':
                execCommand('italic');
                break;
            case 'underline':
                execCommand('underline');
                break;
            case 'h1':
            case 'h2':
            case 'h3':
                execCommand('formatBlock', `<${format}>`);
                break;
            case 'p':
                execCommand('formatBlock', '<p>');
                break;
            case 'ul':
                execCommand('insertUnorderedList');
                break;
            case 'ol':
                execCommand('insertOrderedList');
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Formatting Toolbar */}
            <div className="flex items-center p-2 border-b border-slate-700/50 bg-slate-800/80 rounded-t-lg">
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => formatText('bold')}
                        className={`p-1.5 rounded ${
                            editorState.isBold ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Bold"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                    </button>
                    
                    <button
                        onClick={() => formatText('italic')}
                        className={`p-1.5 rounded ${
                            editorState.isItalic ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Italic"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="4" x2="10" y2="4"></line>
                            <line x1="14" y1="20" x2="5" y2="20"></line>
                            <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                    </button>
                    
                    <button
                        onClick={() => formatText('underline')}
                        className={`p-1.5 rounded ${
                            editorState.isUnderline ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Underline"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                            <line x1="4" y1="21" x2="20" y2="21"></line>
                        </svg>
                    </button>
                    
                    <div className="h-6 border-r border-slate-600 mx-1"></div>
                    
                    <button
                        onClick={() => formatText('h1')}
                        className={`p-1.5 rounded ${
                            editorState.heading === 'h1' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Heading 1"
                    >
                        <span className="font-bold text-sm">H1</span>
                    </button>
                    
                    <button
                        onClick={() => formatText('h2')}
                        className={`p-1.5 rounded ${
                            editorState.heading === 'h2' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Heading 2"
                    >
                        <span className="font-bold text-sm">H2</span>
                    </button>
                    
                    <button
                        onClick={() => formatText('h3')}
                        className={`p-1.5 rounded ${
                            editorState.heading === 'h3' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Heading 3"
                    >
                        <span className="font-bold text-sm">H3</span>
                    </button>
                    
                    <button
                        onClick={() => formatText('p')}
                        className={`p-1.5 rounded ${
                            editorState.heading === 'p' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Paragraph"
                    >
                        <span className="font-medium text-sm">P</span>
                    </button>
                    
                    <div className="h-6 border-r border-slate-600 mx-1"></div>
                    
                    <button
                        onClick={() => formatText('ul')}
                        className={`p-1.5 rounded ${
                            editorState.list === 'ul' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Bullet List"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </button>
                    
                    <button
                        onClick={() => formatText('ol')}
                        className={`p-1.5 rounded ${
                            editorState.list === 'ol' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                        title="Numbered List"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="10" y1="6" x2="21" y2="6"></line>
                            <line x1="10" y1="12" x2="21" y2="12"></line>
                            <line x1="10" y1="18" x2="21" y2="18"></line>
                            <path d="M4 6h1v4"></path>
                            <path d="M4 10h2"></path>
                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Editor Content */}
            <div
                ref={editorRef}
                className="flex-1 p-6 text-slate-100 outline-none overflow-auto"
                contentEditable
                onInput={handleContentChange}
                onSelect={handleSelectionChange}
                onBlur={handleContentChange}
                style={{ minHeight: '200px' }}
            />
        </div>
    );
});

export default RichTextEditor; 