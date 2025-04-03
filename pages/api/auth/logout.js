import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/utils/auth';
import storiesDb from '../../../lib/db/stories';

export default async function logoutRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session
    const session = await getIronSession(req, res, sessionOptions);
    
    // Archive recently highlighted words before logout
    if (session.user) {
      storiesDb.archiveRecentHighlights(session.user.id);
    }
    
    // Destroy the session
    session.destroy();
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'An error occurred during logout' });
  }
}