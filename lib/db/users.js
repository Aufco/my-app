const db = require('./db');
const bcrypt = require('bcryptjs');

const usersDb = {
  // Create a new user
  create: (username, password) => {
    // No password complexity validation
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      const result = stmt.run(username, hashedPassword);
      return { id: result.lastInsertRowid, username };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new Error('Username already exists');
      }
      throw error;
    }
  },

  // Get user by username
  getByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  // Get user by ID
  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  // Verify user credentials
  verify: (username, password) => {
    const user = usersDb.getByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }
    return { id: user.id, username: user.username };
  },

  // Update user language preferences
  updateLanguagePreferences: (userId, selectedLanguage, nativeLanguage) => {
    const stmt = db.prepare('UPDATE users SET selectedLanguage = ?, nativeLanguage = ? WHERE id = ?');
    stmt.run(selectedLanguage, nativeLanguage, userId);
    return usersDb.getById(userId);
  },

  // Get user language preferences
  getLanguagePreferences: (userId) => {
    const user = usersDb.getById(userId);
    return {
      selectedLanguage: user.selectedLanguage || 'Spanish',
      nativeLanguage: user.nativeLanguage || 'English'
    };
  }
};

module.exports = usersDb;