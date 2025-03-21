import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/utils/auth';
import { regenerateStory } from '../../../lib/api/openai';
import storiesDb from '../../../lib/db/stories';
import usersDb from '../../../lib/db/users';

export default async function handler(req, res) {
  // Get session
  const session = await getIronSession(req, res, sessionOptions);
  
  // Check if user is authenticated
  if (!session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's current story
    const currentStory = storiesDb.getLatest(session.user.id);
    
    if (!currentStory) {
      return res.status(404).json({ error: 'No story found' });
    }
    
    // Get the recently highlighted words
    const highlightedWords = storiesDb.getRecentHighlights(session.user.id);
    
    // Get the user's language preference
    const { selectedLanguage } = req.body || {};
    
    // If no language is provided in the request, get it from the database
    let language = selectedLanguage;
    if (!language) {
      const preferences = usersDb.getLanguagePreferences(session.user.id);
      language = preferences.selectedLanguage;
    }
    
    // Regenerate the story
    const simplifiedStory = await regenerateStory(currentStory.content, highlightedWords, language);
    
    // Save the regenerated story
    const savedStory = storiesDb.save(session.user.id, simplifiedStory);
    
    return res.status(200).json({ story: savedStory.content });
  } catch (error) {
    console.error('Error regenerating story:', error);
    return res.status(500).json({ error: 'Failed to regenerate story' });
  }
}