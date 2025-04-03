import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session
    const session = await getIronSession(req, res, sessionOptions);
    
    // Return user if logged in
    if (session.user) {
      return res.status(200).json({ user: session.user });
    }
    
    // Otherwise return null
    return res.status(200).json({ user: null });
  } catch (error) {
    console.error('User fetch error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}