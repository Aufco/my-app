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
    // Archive recently highlighted words
    storiesDb.archiveRecentHighlights(session.user.id);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error archiving highlights:', error);
    return res.status(500).json({ error: 'Failed to archive highlights' });
  }
}