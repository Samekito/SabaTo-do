// HTTP layer: reads from req, calls the service, and shapes the response.
// All business logic and storage live in the service and repository.

const service = require('../services/todos');

// Sends an error response using the statusCode the service attached (defaults to 500).
const sendError = (res, err) => {
  res.status(err.statusCode || 500).json({ success: false, msg: err.message });
};

const getAllTodos = (req, res) => {
  res.status(200).json({ success: true, data: service.getAllTodos() });
};

const getTodo = (req, res) => {
  try {
    const todo = service.getTodoById(req.params.id);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    sendError(res, err);
  }
};

const createTodo = (req, res) => {
  try {
    const todo = service.createTodo(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    sendError(res, err);
  }
};

const updateTodo = (req, res) => {
  try {
    const todo = service.replaceTodo(req.params.id, req.body);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    sendError(res, err);
  }
};

const updateTodoPartial = (req, res) => {
  try {
    const todo = service.updateTodoPartial(req.params.id, req.body);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    sendError(res, err);
  }
};

const deleteTodo = (req, res) => {
  try {
    const { id } = req.params;
    service.deleteTodo(id);
    res.status(200).json({ success: true, msg: `Todo with id ${id} was deleted` });
  } catch (err) {
    sendError(res, err);
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  updateTodoPartial,
  deleteTodo,
};
