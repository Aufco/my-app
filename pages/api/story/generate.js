import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/utils/auth';
import { generateSimpleStory } from '../../../lib/api/openai';
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
    // Generate a new story
    const story = await generateSimpleStory();
    
    // Save the story to the database
    const savedStory = storiesDb.save(session.user.id, story);
    
    return res.status(200).json({ story: savedStory.content });
  } catch (error) {
    console.error('Error generating story:', error);
    return res.status(500).json({ error: 'Failed to generate story' });
  }
}