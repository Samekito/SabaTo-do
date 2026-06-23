const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'todos.db'));

// Enable WAL mode for better performance (reads don't block writes)
db.pragma('journal_mode = WAL');

// Create the todos table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    completed   INTEGER NOT NULL DEFAULT 0,
    createdAt   TEXT    NOT NULL,
    updatedAt   TEXT    NOT NULL
  )
`);

// Seeds 3 starter todos on first run (when the table is empty)
const count = db.prepare('SELECT COUNT(*) AS count FROM todos').get().count;
if (count === 0) {
  const now = new Date().toISOString();
  const insert = db.prepare(
    'INSERT INTO todos (title, description, completed, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?)'
  );
  insert.run('Saba is cooked', '', now, now);
  insert.run('Saba is warmed', '', now, now);
  insert.run('Saba is roasted', '', now, now);
}

module.exports = db;
