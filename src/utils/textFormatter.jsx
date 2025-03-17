import React from 'react';

/**
 * Formats text with markdown-like syntax
 * Supports:
 * - **bold**
 * - *italic*
 * - __underline__
 * - ~~strikethrough~~
 * - ```code blocks```
 * - `inline code`
 * - > blockquotes
 * - Ordered and unordered lists
 * - Headers (# Header)
 * - Horizontal rules (---)
 * - Line breaks
 */
export const formatText = (text) => {
  if (!text) return null;

  // Split the text into lines to handle block-level elements
  const lines = text.split('\n');
  const formattedLines = [];
  
  let inCodeBlock = false;
  let codeBlockContent = '';
  let inOrderedList = false;
  let inUnorderedList = false;
  let listItems = [];
  let inTable = false;
  let tableRows = [];
  let tableHeaders = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Check if this is a header separator line
      const isHeaderSeparator = line.replace(/\|/g, '').trim().replace(/[^-:]/g, '') !== '';
      
      if (!inTable) {
        // Start of table
        inTable = true;
        tableRows = [];
        
        // If this is not a separator line, it's a header
        if (!isHeaderSeparator) {
          tableHeaders = line
            .trim()
            .split('|')
            .filter(cell => cell.trim() !== '')
            .map(cell => cell.trim());
        }
      } else if (isHeaderSeparator) {
        // This is a separator line, skip it
        continue;
      } else {
        // This is a data row
        const rowCells = line
          .trim()
          .split('|')
          .filter(cell => cell.trim() !== '')
          .map(cell => formatInlineText(cell.trim()));
        
        tableRows.push(rowCells);
      }
      
      // If the next line doesn't start with |, or this is the last line, render the table
      if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('|')) {
        formattedLines.push(
          <div key={`table-${i}`} className="my-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-md">
              {tableHeaders.length > 0 && (
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th 
                        key={idx} 
                        className="px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-slate-700 last:border-r-0"
                      >
                        {formatInlineText(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}>
                    {row.map((cell, cellIdx) => (
                      <td 
                        key={cellIdx} 
                        className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
        inTable = false;
        tableRows = [];
        tableHeaders = [];
      }
      
      continue;
    }
    
    // Handle code blocks
    if (line.trim().startsWith('```') || line.trim().endsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        // Remove the backticks from the first line if it only contains backticks
        if (line.trim() === '```') {
          continue;
        }
        // Otherwise, remove the backticks and keep the rest (language specification)
        codeBlockContent = line.replace(/```/, '').trim() + '\n';
      } else {
        // End of code block
        inCodeBlock = false;
        formattedLines.push(
          <pre key={`code-${i}`} className="bg-slate-800 text-slate-200 p-3 rounded-md my-2 overflow-x-auto text-sm font-mono border border-slate-700">
            <code>{codeBlockContent}</code>
          </pre>
        );
        codeBlockContent = '';
      }
      continue;
    }
    
    // If we're in a code block, just add the line to the code content
    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }
    
    // Handle ordered lists
    if (line.match(/^\d+\.\s/)) {
      if (!inOrderedList) {
        inOrderedList = true;
        listItems = [];
      }
      
      // Extract the list item content
      const content = line.replace(/^\d+\.\s/, '');
      // Format the content (for inline formatting)
      listItems.push(formatInlineText(content));
      
      // If the next line is not a list item or this is the last line, render the list
      if (i === lines.length - 1 || !lines[i + 1].match(/^\d+\.\s/)) {
        formattedLines.push(
          <ol key={`ol-${i}`} className="list-decimal pl-6 my-2 space-y-1" start="1">
            {listItems.map((item, idx) => (
              <li key={idx} className="my-1" value={idx + 1}>{item}</li>
            ))}
          </ol>
        );
        inOrderedList = false;
        listItems = [];
      }
      continue;
    }
    
    // Handle unordered lists
    if (line.match(/^[\-\*\•]\s/)) {
      if (!inUnorderedList) {
        inUnorderedList = true;
        listItems = [];
      }
      
      // Extract the list item content
      const content = line.replace(/^[\-\*\•]\s/, '');
      // Format the content (for inline formatting)
      listItems.push(formatInlineText(content));
      
      // If the next line is not a list item or this is the last line, render the list
      if (i === lines.length - 1 || !lines[i + 1].match(/^[\-\*\•]\s/)) {
        formattedLines.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 my-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="my-1">{item}</li>
            ))}
          </ul>
        );
        inUnorderedList = false;
        listItems = [];
      }
      continue;
    }
    
    // Handle headers
    if (line.startsWith('# ')) {
      formattedLines.push(
        <h1 key={`h1-${i}`} className="text-xl font-bold my-3 pb-1 border-b border-slate-200 dark:border-slate-700">
          {formatInlineText(line.substring(2))}
        </h1>
      );
      continue;
    }
    
    if (line.startsWith('## ')) {
      formattedLines.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold my-2 text-slate-800 dark:text-slate-200">
          {formatInlineText(line.substring(3))}
        </h2>
      );
      continue;
    }
    
    if (line.startsWith('### ')) {
      formattedLines.push(
        <h3 key={`h3-${i}`} className="text-md font-semibold my-2 text-slate-700 dark:text-slate-300">
          {formatInlineText(line.substring(4))}
        </h3>
      );
      continue;
    }
    
    // Handle blockquotes
    if (line.startsWith('> ')) {
      formattedLines.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-slate-400 dark:border-slate-600 pl-3 py-1 italic my-2 text-slate-600 dark:text-slate-300">
          {formatInlineText(line.substring(2))}
        </blockquote>
      );
      continue;
    }
    
    // Handle horizontal rules
    if (line.match(/^-{3,}$/) || line.match(/^_{3,}$/) || line.match(/^\*{3,}$/)) {
      formattedLines.push(<hr key={`hr-${i}`} className="my-4 border-t border-slate-300 dark:border-slate-600" />);
      continue;
    }
    
    // Handle regular paragraphs
    if (line.trim() !== '') {
      formattedLines.push(
        <p key={`p-${i}`} className="my-1.5 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    } else {
      // Empty line
      formattedLines.push(<div key={`br-${i}`} className="h-2" />);
    }
  }
  
  return (
    <div className="formatted-text text-sm space-y-1">
      {formattedLines}
    </div>
  );
};

/**
 * Formats inline text elements like bold, italic, code, etc.
 */
const formatInlineText = (text) => {
  if (!text) return null;
  
  // Array to hold the formatted parts
  const parts = [];
  
  // Split the text by inline code blocks first
  const codeRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;
  
  while ((match = codeRegex.exec(text)) !== null) {
    // Add the text before the code block
    if (match.index > lastIndex) {
      const beforeText = formatRichText(text.substring(lastIndex, match.index), `before-${match.index}`);
      parts.push(beforeText);
    }
    
    // Add the code block
    parts.push(
      <code key={`code-${match.index}`} className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-sm">
        {match[1]}
      </code>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    const remainingText = formatRichText(text.substring(lastIndex), `remaining-${lastIndex}`);
    parts.push(remainingText);
  }
  
  return parts.length > 0 ? parts : text;
};

/**
 * Formats rich text elements (bold, italic, underline, strikethrough)
 */
const formatRichText = (text, keyPrefix = '') => {
  if (!text) return null;
  
  // Handle bold: **text** or __text__
  text = text.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (match, p1, p2) => {
    const content = p1 || p2;
    return `<strong>${content}</strong>`;
  });
  
  // Handle italic: *text* or _text_
  text = text.replace(/\*(.*?)\*|_(.*?)_/g, (match, p1, p2) => {
    const content = p1 || p2;
    return `<em>${content}</em>`;
  });
  
  // Handle underline: ~_text_~
  text = text.replace(/~_(.*?)_~/g, '<u>$1</u>');
  
  // Handle strikethrough: ~~text~~
  text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // Handle links: [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle auto-linking URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, (url) => {
    // Don't double-link URLs that are already in a link tag
    if (url.match(/<a[^>]*>/)) return url;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
  
  // Convert the HTML string back to React elements
  return <span key={keyPrefix} dangerouslySetInnerHTML={{ __html: text }} />;
}; 