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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's current story
    const story = storiesDb.getLatest(session.user.id);
    
    return res.status(200).json({
      story: story ? story.content : null
    });
  } catch (error) {
    console.error('Error fetching current story:', error);
    return res.status(500).json({ error: 'Failed to fetch story' });
  }
}