import React, { useState } from 'react';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded text-xs text-white font-medium transition-all duration-200 hover:scale-105"
      title="Copy code to clipboard"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

const MessageRenderer = ({ text }) => {
  const parseMessage = (text) => {
    const parts = [];
    let currentIndex = 0;
    
    // Regex patterns for different markdown elements
    const patterns = [
      { type: 'code_block', regex: /```([\s\S]*?)```/g },
      { type: 'inline_code', regex: /`([^`]+)`/g },
      { type: 'bold', regex: /\*\*([^*]+)\*\*/g },
      { type: 'italic', regex: /\*([^*]+)\*/g },
    ];
    
    // Find all matches
    const matches = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        matches.push({
          type: pattern.type,
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          fullMatch: match[0]
        });
      }
    });
    
    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);
    
    // Remove overlapping matches (keep the first one)
    const filteredMatches = [];
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const hasOverlap = filteredMatches.some(existing => 
        (current.start >= existing.start && current.start < existing.end) ||
        (current.end > existing.start && current.end <= existing.end)
      );
      if (!hasOverlap) {
        filteredMatches.push(current);
      }
    }
    
    // Build the result
    let lastIndex = 0;
    filteredMatches.forEach((match, index) => {
      // Add text before the match
      if (match.start > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.start),
          key: `text-${index}-before`
        });
      }
      
      // Add the formatted match
      parts.push({
        type: match.type,
        content: match.content,
        key: `${match.type}-${index}`
      });
      
      lastIndex = match.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
        key: 'text-end'
      });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: text, key: 'text-only' }];
  };
  
  const renderPart = (part) => {
    switch (part.type) {
      case 'code_block':
        return (
          <div key={part.key} className="bg-gray-900 rounded-lg mt-3 mb-3 border border-gray-600 overflow-hidden shadow-lg">
            <div className="flex items-center px-4 py-3 bg-gray-800 border-b border-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-sm text-gray-300 font-medium">Code</span>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-green-300 leading-relaxed bg-gray-900 selection:bg-gray-700">
              <code className="block">{part.content}</code>
            </pre>
            <div className="px-4 py-3 bg-gray-800 border-t border-gray-600 flex justify-end">
              <CopyButton text={part.content} />
            </div>
          </div>
        );
      case 'inline_code':
        return (
          <code key={part.key} className="bg-gray-800 text-green-300 px-2 py-0.5 rounded text-sm font-mono border border-gray-600 font-medium">
            {part.content}
          </code>
        );
      case 'bold':
        return (
          <strong key={part.key} className="font-bold">
            {part.content}
          </strong>
        );
      case 'italic':
        return (
          <em key={part.key} className="italic">
            {part.content}
          </em>
        );
      case 'text':
      default:
        return (
          <span key={part.key}>
            {part.content}
          </span>
        );
    }
  };
  
  const parts = parseMessage(text);
  
  return (
    <div className="break-words whitespace-pre-wrap leading-relaxed">
      {parts.map(renderPart)}
    </div>
  );
};

export default MessageRenderer;
