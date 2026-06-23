const db = require('../db/database');

// SQLite stores booleans as 0/1 integers. This converts a row back to JS shape.
const toTodo = (row) => ({
  ...row,
  id: String(row.id),
  completed: row.completed === 1,
});

const findAll = () =>
  db.prepare('SELECT * FROM todos ORDER BY id ASC').all().map(toTodo);

const findById = (id) => {
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  return row ? toTodo(row) : null;
};

// Inserts a new todo and returns the full stored record (including generated id).
const create = ({ title, description, completed, createdAt, updatedAt }) => {
  const result = db.prepare(
    'INSERT INTO todos (title, description, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
  ).run(title, description, completed ? 1 : 0, createdAt, updatedAt);

  return findById(result.lastInsertRowid);
};

// Merges the given changes onto an existing todo.
// Returns the updated record, or null if no todo with that id exists.
const update = (id, changes) => {
  const existing = findById(id);
  if (!existing) return null;

  // Build the SET clause dynamically from whatever fields were passed in
  const fields = Object.keys(changes);
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) =>
    f === 'completed' ? (changes[f] ? 1 : 0) : changes[f]
  );

  db.prepare(`UPDATE todos SET ${setClause} WHERE id = ?`).run(...values, id);
  return findById(id);
};

// Removes a todo. Returns true if something was deleted, false otherwise.
const remove = (id) => {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return result.changes > 0;
};

module.exports = { findAll, findById, create, update, remove };
