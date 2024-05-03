const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todos', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define Todo schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// Create a new todo
app.post('/todos', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = new Todo({
      title,
      description,
      completed
    });
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific todo
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo === null) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a todo
app.patch('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo === null) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (req.body.title != null) {
      todo.title = req.body.title;
    }
    if (req.body.description != null) {
      todo.description = req.body.description;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (todo === null) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      await todo.deleteOne(); // Using deleteOne() to remove the todo
      res.json({ message: 'Todo deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
