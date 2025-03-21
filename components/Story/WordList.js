import React from 'react';

export default function WordList({ title, words, className }) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
      {words && words.length > 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-wrap gap-2">
            {words.map((word, index) => (
              <span
                key={index}
                className="bg-yellow-200 px-2 py-1 rounded text-sm text-gray-800"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No words highlighted yet.</p>
      )}
    </div>
  );
}