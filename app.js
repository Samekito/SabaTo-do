// Initialise the database (creates the file + table on first run)
require('./db/database');

// express module to create our web server
const express = require('express');

const app = express();
const todos = require('./routes/todos');


const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Middleware to parse incoming JSON data from HTTP requests
// Without this, req.body will be undefined in our controllers!
app.use(express.json());

// Basic home route to verify the server is running
app.get('/', (req, res) => {
  res.send('<h1>Todo API</h1><p>Send requests to <code>/api/todos</code></p>');
});

// Any request starting with '/api/todos' will be handled by the 'todos' router
app.use('/api/todos', todos);

// Uses the 404 middleware for any routes that don't exist
app.use(notFound);

// Uses the global error handler for any errors thrown
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// Start the server
const start = () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
