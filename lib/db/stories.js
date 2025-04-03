const db = require('./db');

const storiesDb = {
  // Save a new story for user
  save: (userId, content) => {
    // Delete previous stories for this user
    const deleteStmt = db.prepare('DELETE FROM stories WHERE user_id = ?');
    deleteStmt.run(userId);
    
    // Insert new story
    const insertStmt = db.prepare('INSERT INTO stories (user_id, content) VALUES (?, ?)');
    const result = insertStmt.run(userId, content);
    return { id: result.lastInsertRowid, content };
  },

  // Get the latest story for a user
  getLatest: (userId) => {
    const stmt = db.prepare(`
      SELECT * FROM stories 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    return stmt.get(userId);
  },

  // Save a highlighted word
  saveHighlightedWord: (userId, word) => {
    const stmt = db.prepare('INSERT INTO highlighted_words (user_id, word) VALUES (?, ?)');
    stmt.run(userId, word);
  },

  // Get recently highlighted words for a user
  getRecentHighlights: (userId) => {
    const stmt = db.prepare(`
      SELECT word FROM highlighted_words
      WHERE user_id = ? AND is_recent = 1
      ORDER BY created_at DESC
    `);
    const results = stmt.all(userId);
    return results.map(row => row.word);
  },

  // Get previously highlighted words for a user
  getPreviousHighlights: (userId) => {
    const stmt = db.prepare(`
      SELECT word FROM highlighted_words
      WHERE user_id = ? AND is_recent = 0
      ORDER BY created_at DESC
    `);
    const results = stmt.all(userId);
    return results.map(row => row.word);
  },

  // Move recently highlighted words to previous highlights
  archiveRecentHighlights: (userId) => {
    const stmt = db.prepare('UPDATE highlighted_words SET is_recent = 0 WHERE user_id = ? AND is_recent = 1');
    stmt.run(userId);
  }
};

module.exports = storiesDb;