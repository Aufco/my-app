import { useState, useEffect } from 'react';
import HighlightableText from './HighlightableText';
import WordList from './WordList';
import ComprehensionMeter from './ComprehensionMeter';
import { calculateComprehension } from '../../lib/utils/text';

export default function StoryDisplay() {
  const [story, setStory] = useState('');
  const [recentHighlights, setRecentHighlights] = useState([]);
  const [previousHighlights, setPreviousHighlights] = useState([]);
  const [comprehension, setComprehension] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Fetch user's highlighted words on load
  useEffect(() => {
    fetchWords();
    fetchCurrentStory();
  }, []);

  // Update comprehension when story or highlights change
  useEffect(() => {
    const newComprehension = calculateComprehension(story, recentHighlights);
    setComprehension(newComprehension);
  }, [story, recentHighlights]);

  // Fetch user's current story
  const fetchCurrentStory = async () => {
    try {
      const response = await fetch('/api/story/current');
      
      if (response.ok) {
        const data = await response.json();
        if (data.story) {
          setStory(data.story);
        }
      }
    } catch (error) {
      console.error('Error fetching current story:', error);
    }
  };

  // Fetch user's highlighted words
  const fetchWords = async () => {
    try {
      const response = await fetch('/api/user/words');
      
      if (response.ok) {
        const data = await response.json();
        setRecentHighlights(data.recentHighlights || []);
        setPreviousHighlights(data.previousHighlights || []);
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  // Handle word highlighting
  const handleHighlight = async (word) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/story/highlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentHighlights(data.recentHighlights);
      }
    } catch (error) {
      console.error('Error highlighting word:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new story
  const generateStory = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStory(data.story);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate a story
  const regenerateStory = async () => {
    setIsRegenerating(true);
    
    try {
      const response = await fetch('/api/story/regenerate', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStory(data.story);
      }
    } catch (error) {
      console.error('Error regenerating story:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={generateStory}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isGenerating ? 'Generating...' : 'Generate Story'}
        </button>
        
        <button
          onClick={regenerateStory}
          disabled={isRegenerating || !story}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Story'}
        </button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Current Story</h2>
        {story ? (
          <HighlightableText text={story} onHighlight={handleHighlight} />
        ) : (
          <p className="text-gray-500">No story generated yet. Click "Generate Story" to start.</p>
        )}
      </div>
      
      {story && (
        <ComprehensionMeter comprehension={comprehension} />
      )}
      
      <WordList
        title="Recently Highlighted Words"
        words={recentHighlights}
        className="mt-6"
      />
      
      <WordList
        title="Previously Highlighted Words"
        words={previousHighlights}
        className="mt-6"
      />
    </div>
  );
}