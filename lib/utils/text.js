// Calculate comprehension based on highlighted words
export function calculateComprehension(text, highlightedWords) {
    if (!text || !highlightedWords || !highlightedWords.length) {
      return 100; // If no words are highlighted, comprehension is 100%
    }
    
    // Split text into words and filter out punctuation
    const words = text.split(/\s+/).map(word => word.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ]/g, ''));
    const totalWords = words.filter(word => word.length > 0).length;
    
    // Count how many unique words were highlighted
    const uniqueHighlighted = new Set(highlightedWords).size;
    
    // Calculate non-highlighted words percentage
    const nonHighlighted = totalWords - uniqueHighlighted;
    const comprehension = Math.round((nonHighlighted / totalWords) * 100);
    
    return comprehension;
  }