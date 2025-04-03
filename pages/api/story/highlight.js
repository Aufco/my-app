import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/utils/auth';
import storiesDb from '../../../lib/db/stories';

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
    const { word } = req.body;
    
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }
    
    // Save the highlighted word
    storiesDb.saveHighlightedWord(session.user.id, word);
    
    // Get the updated list of recently highlighted words
    const recentHighlights = storiesDb.getRecentHighlights(session.user.id);
    
    return res.status(200).json({ recentHighlights });
  } catch (error) {
    console.error('Error highlighting word:', error);
    return res.status(500).json({ error: 'Failed to highlight word' });
  }
}