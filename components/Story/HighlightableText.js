import { useState } from 'react';

export default function HighlightableText({ text, onHighlight, recentHighlights = [], previousHighlights = [] }) {
  // Combine recent and previous highlights for display
  const allHighlightedWords = [...recentHighlights, ...previousHighlights];

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
          
          // Check if this word is highlighted
          const isHighlighted = cleanWord && allHighlightedWords.includes(cleanWord);
          
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