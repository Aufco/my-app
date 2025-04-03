import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import HighlightableText from './HighlightableText';
import WordList from './WordList';
import ComprehensionMeter from './ComprehensionMeter';
import { calculateComprehension } from '../../lib/utils/text';

// List of supported languages
const LANGUAGES = [
  'English', // Added English at the top
  'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese',
  'Catalan', 'Chinese', 'Croatian', 'Czech', 'Danish', 'Dutch', 'Estonian', 'Finnish', 
  'French', 'Georgian', 'German', 'Greek', 'Gujarati', 'Hindi', 'Hungarian', 'Icelandic', 
  'Indonesian', 'Italian', 'Japanese', 'Kannada', 'Kazakh', 'Korean', 'Latvian', 'Lithuanian',
  'Macedonian', 'Malay', 'Malayalam', 'Marathi', 'Mongolian', 'Norwegian', 'Persian', 'Polish',
  'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Serbian', 'Slovak', 'Slovenian', 'Somali',
  'Spanish', 'Swahili', 'Swedish', 'Tagalog', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian',
  'Urdu', 'Vietnamese'
];

export default function StoryDisplay() {
  const [story, setStory] = useState('');
  const [recentHighlights, setRecentHighlights] = useState([]);
  const [previousHighlights, setPreviousHighlights] = useState([]);
  const [comprehension, setComprehension] = useState(100);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Changed default to English
  const [nativeLanguage, setNativeLanguage] = useState('English'); // Changed default to English
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);

  // Fetch user's highlighted words on load
  useEffect(() => {
    fetchWords();
    fetchCurrentStory();
    fetchLanguagePreferences();
  }, []);

  // Update comprehension when story or highlights change
  useEffect(() => {
    const newComprehension = calculateComprehension(story, recentHighlights);
    setComprehension(newComprehension);
  }, [story, recentHighlights]);

  // Fetch user's language preferences
  const fetchLanguagePreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      
      if (response.ok) {
        const data = await response.json();
        setSelectedLanguage(data.selectedLanguage || 'English');
        setNativeLanguage(data.nativeLanguage || 'English');
      }
    } catch (error) {
      console.error('Error fetching language preferences:', error);
    }
  };

  // Save user's language preferences
  const saveLanguagePreferences = async () => {
    setIsSavingLanguage(true);
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedLanguage, nativeLanguage }),
      });
    } catch (error) {
      console.error('Error saving language preferences:', error);
    } finally {
      setIsSavingLanguage(false);
    }
  };

  // Handle language selection changes
  const handleSelectedLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    saveLanguagePreferences();
  };

  const handleNativeLanguageChange = (e) => {
    setNativeLanguage(e.target.value);
    saveLanguagePreferences();
  };

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
      // First, archive current recently highlighted words if any exist
      if (recentHighlights.length > 0) {
        await fetch('/api/story/archiveHighlights', {
          method: 'POST',
        });
      }
      
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedLanguage }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStory(data.story);
        // Clear highlights when generating a new story
        setRecentHighlights([]);
        // Refresh previous highlights
        fetchWords();
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
      // First, archive current recently highlighted words if any exist
      if (recentHighlights.length > 0) {
        await fetch('/api/story/archiveHighlights', {
          method: 'POST',
        });
      }
      
      const response = await fetch('/api/story/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedLanguage }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStory(data.story);
        // Clear highlights when regenerating a story
        setRecentHighlights([]);
        // Refresh previous highlights
        fetchWords();
      }
    } catch (error) {
      console.error('Error regenerating story:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Archive recently highlighted words
  const archiveHighlights = async () => {
    setIsArchiving(true);
    
    try {
      const response = await fetch('/api/story/archiveHighlights', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Fetch updated words after archiving
        await fetchWords();
      }
    } catch (error) {
      console.error('Error archiving highlights:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Selected Language</h2>
        <select
          value={selectedLanguage}
          onChange={handleSelectedLanguageChange}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800 bg-white"
          disabled={isSavingLanguage}
        >
          {LANGUAGES.map((language) => (
            <option key={language} value={language} className="text-gray-800">{language}</option>
          ))}
        </select>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Native Language</h2>
        <select
          value={nativeLanguage}
          onChange={handleNativeLanguageChange}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800 bg-white"
          disabled={isSavingLanguage}
        >
          {LANGUAGES.map((language) => (
            <option key={language} value={language} className="text-gray-800">{language}</option>
          ))}
        </select>
      </div>

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
        <h2 className="text-xl font-bold text-gray-800 mb-2">Current Story</h2>
        {story ? (
          <HighlightableText 
            text={story} 
            onHighlight={handleHighlight}
            recentHighlights={recentHighlights}
            previousHighlights={previousHighlights}
          />
        ) : (
          <p className="text-gray-500">No story generated yet. Click "Generate Story" to start.</p>
        )}
      </div>
      
      {story && (
        <ComprehensionMeter comprehension={comprehension} />
      )}
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Recently Highlighted Words</h2>
          {recentHighlights && recentHighlights.length > 0 && (
            <button
              onClick={archiveHighlights}
              disabled={isArchiving}
              className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:bg-amber-300 text-sm"
            >
              {isArchiving ? 'Moving...' : 'Move to Previously Highlighted'}
            </button>
          )}
        </div>
        {recentHighlights && recentHighlights.length > 0 ? (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-wrap gap-2">
              {recentHighlights.map((word, index) => (
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
      
      <WordList
        title="Previously Highlighted Words"
        words={previousHighlights}
        className="mt-6"
      />
    </div>
  );
}