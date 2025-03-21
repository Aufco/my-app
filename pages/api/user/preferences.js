import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/utils/auth';
import usersDb from '../../../lib/db/users';

export default async function handler(req, res) {
  // Get session
  const session = await getIronSession(req, res, sessionOptions);
  
  // Check if user is authenticated
  if (!session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // GET request to fetch language preferences
  if (req.method === 'GET') {
    try {
      const preferences = usersDb.getLanguagePreferences(session.user.id);
      return res.status(200).json(preferences);
    } catch (error) {
      console.error('Error fetching language preferences:', error);
      return res.status(500).json({ error: 'Failed to fetch language preferences' });
    }
  }

  // POST request to update language preferences
  if (req.method === 'POST') {
    const { selectedLanguage, nativeLanguage } = req.body;
    
    if (!selectedLanguage || !nativeLanguage) {
      return res.status(400).json({ error: 'Both languages are required' });
    }

    try {
      const updatedUser = usersDb.updateLanguagePreferences(
        session.user.id,
        selectedLanguage,
        nativeLanguage
      );
      
      return res.status(200).json({
        selectedLanguage: updatedUser.selectedLanguage,
        nativeLanguage: updatedUser.nativeLanguage
      });
    } catch (error) {
      console.error('Error updating language preferences:', error);
      return res.status(500).json({ error: 'Failed to update language preferences' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}