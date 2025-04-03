import React from 'react';

export default function ComprehensionMeter({ comprehension }) {
  // Determine color based on comprehension level
  const getColor = () => {
    if (comprehension >= 85) return 'bg-green-500';
    if (comprehension >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">Comprehension</h2>
        <span className="font-bold">{comprehension}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${getColor()} h-4 rounded-full transition-all duration-300`}
          style={{ width: `${comprehension}%` }}
        ></div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        {comprehension < 85 ? (
          <span className="text-red-500 font-semibold">
            Your comprehension is below 85%. Consider regenerating the story for simpler language.
          </span>
        ) : (
          <span>Regenerate story if comprehension drops below 85%.</span>
        )}
      </p>
    </div>
  );
}