const repository = require('../repositories/todos');

// Builds an Error carrying the HTTP status the controller should send.
const createError = (statusCode, msg) => {
  const error = new Error(msg);
  error.statusCode = statusCode;
  return error;
};

const getAllTodos = () => repository.findAll();

const getTodoById = (id) => {
  const todo = repository.findById(id);
  if (!todo) {
    throw createError(404, `No todo with id ${id}`);
  }
  return todo;
};

const createTodo = ({ title, description }) => {
  if (!title) {
    throw createError(400, 'Please provide a title value');
  }

  const now = new Date().toISOString();
  return repository.create({
    title,
    description: description || '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
};

// Full replace (PUT): requires title and completed.
const replaceTodo = (id, { title, description, completed }) => {
  if (!title || completed === undefined) {
    throw createError(400, 'Please provide all fields (title, completed) for a full update');
  }

  if (!repository.findById(id)) {
    throw createError(404, `No todo with id ${id}`);
  }

  return repository.update(id, {
    title,
    description: description || '',
    completed,
    updatedAt: new Date().toISOString(),
  });
};

// Partial update (PATCH): only the provided fields are changed.
const updateTodoPartial = (id, { title, description, completed }) => {
  if (!repository.findById(id)) {
    throw createError(404, `No todo with id ${id}`);
  }

  const changes = {};
  if (title !== undefined) changes.title = title;
  if (description !== undefined) changes.description = description;
  if (completed !== undefined) changes.completed = Boolean(completed);
  changes.updatedAt = new Date().toISOString();

  return repository.update(id, changes);
};

const deleteTodo = (id) => {
  const deleted = repository.remove(id);
  if (!deleted) {
    throw createError(404, `No todo with id ${id}`);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  replaceTodo,
  updateTodoPartial,
  deleteTodo,
};
