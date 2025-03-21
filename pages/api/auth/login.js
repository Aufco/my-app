import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/utils/auth';
import usersDb from '../../../lib/db/users';

export default async function loginRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session
    const session = await getIronSession(req, res, sessionOptions);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = usersDb.verify(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set the user in the session
    session.user = { id: user.id, username: user.username };
    await session.save();
    
    return res.status(200).json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}