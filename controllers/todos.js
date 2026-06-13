// In-memory storage for todos and id increment
let nextId = 4;

let todos = [
  { id: '1', title: 'Saba is cooked', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Saba is warmed', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Saba is roasted', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const getAllTodos = (req, res) => {
  res.status(200).json({ success: true, data: todos });
};


const getTodo = (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).json({ success: false, msg: `No todo with id ${id}` });
  }

  res.status(200).json({ success: true, data: todo });
};

const createTodo = (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, msg: 'Please provide a title value' });
  }

  const newTodo = {
    id: String(nextId++),
    title: title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Adds the new todo to my in-memory array
  todos.push(newTodo);

  res.status(201).json({ success: true, data: newTodo });
};

// Updates a todo
const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (!title || completed === undefined) {
    return res.status(400).json({ success: false, msg: 'Please provide all fields (title, completed) for a full update' });
  }

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ success: false, msg: `No todo with id ${id}` });
  }

  const updatedTodo = {
    id: todos[todoIndex].id,
    title: title,
    description: description || '',
    completed: completed,
    createdAt: todos[todoIndex].createdAt,
    updatedAt: new Date().toISOString()
  };

  // replaces the old todo with the new one
  todos[todoIndex] = updatedTodo;

  res.status(200).json({ success: true, data: updatedTodo });
};

// Updates a todo partially
const updateTodoPartial = (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ success: false, msg: `No todo with id ${id}` });
  }


  let existingTodo = todos[todoIndex];
  // Only update fields if they were provided in the request body
  if (title !== undefined) existingTodo.title = title;
  if (description !== undefined) existingTodo.description = description;
  if (completed !== undefined) existingTodo.completed = Boolean(completed);

  // Updates the modification time
  existingTodo.updatedAt = new Date().toISOString();

  todos[todoIndex] = existingTodo;

  res.status(200).json({ success: true, data: existingTodo });
};

// Deletes a todo
const deleteTodo = (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ success: false, msg: `No todo with id ${id}` });
  }

  // Filters out the todo to delete and saves the new array
  todos = todos.filter((todo) => todo.id !== id);

  res.status(200).json({ success: true, msg: `Todo with id ${id} was deleted` });
};

module.exports = {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  updateTodoPartial,
  deleteTodo
};
