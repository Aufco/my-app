import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSimpleStory(selectedLanguage = 'Spanish') {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a helpful assistant that generates simple ${selectedLanguage} stories for language learners.` },
        { role: "user", content: `Generate a simple ${selectedLanguage} story.` }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story');
  }
}

export async function regenerateStory(originalStory, highlightedWords, selectedLanguage = 'Spanish') {
  try {
    const prompt = `Simplify the following ${selectedLanguage} story to help the user reach 85–95% comprehension. Here is the original story: "${originalStory}". The user had difficulty with the following words: ${highlightedWords.join(', ')}. Please regenerate the story in simpler ${selectedLanguage} using different phrasing or vocabulary where possible, while keeping the original meaning.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a helpful assistant that regenerates ${selectedLanguage} stories in simpler language for language learners.` },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error regenerating story:', error);
    throw new Error('Failed to regenerate story');
  }
}