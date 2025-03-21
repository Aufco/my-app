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

  // Other methods remain the same...
  getByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  verify: (username, password) => {
    const user = usersDb.getByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }
    return { id: user.id, username: user.username };
  }
};

module.exports = usersDb;