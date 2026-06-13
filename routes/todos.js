// Import express to create a router
const express = require('express');
const router = express.Router();

const {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  updateTodoPartial,
  deleteTodo
} = require('../controllers/todos');

// router.route('/') handles requests to the root of this router (which is /api/todos)
router.route('/')
  .get(getAllTodos)
  .post(createTodo);

// router.route('/:id') handles requests with a specific ID parameter (like /api/todos/123)
router.route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .patch(updateTodoPartial)
  .delete(deleteTodo);

module.exports = router;
