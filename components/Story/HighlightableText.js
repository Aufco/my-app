import { useState } from 'react';

export default function HighlightableText({ text, onHighlight, recentHighlights = [], previousHighlights = [] }) {
  // We'll no longer use previousHighlights for highlighting in the current story
  
  if (!text) return null;

  // Split text into words, preserving spaces and punctuation
  const words = text.split(/(\s+)/).filter(word => word.trim().length > 0);

  // Handle highlighting a word
  const handleHighlight = (word) => {
    onHighlight(word);
  };

  // Return the text with clickable words
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="leading-relaxed text-gray-800">
        {words.map((word, index) => {
          // Remove punctuation for the word to highlight
          const cleanWord = word.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ]/g, '');
          
          // Check if this word is highlighted - only using recentHighlights now
          const isHighlighted = cleanWord && recentHighlights.includes(cleanWord);
          
          return (
            <span key={index} className="relative">
              <span
                onClick={() => cleanWord && handleHighlight(cleanWord)}
                className={`cursor-pointer ${cleanWord ? 'hover:bg-yellow-200' : ''} ${isHighlighted ? 'bg-yellow-200' : ''}`}
              >
                {word}
              </span>
              {word !== ' ' && ' '}
            </span>
          );
        })}
      </p>
    </div>
  );
}