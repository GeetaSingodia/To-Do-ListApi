
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');

// Custom middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Custom middleware for request time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// In-memory data storage with initial data
let todos = [
    { id: '1', title: 'Buy groceries', category: 'Personal' },
    { id: '2', title: 'Finish project', category: 'Work' }
];
let categories = ['Personal', 'Work', 'Fitness'];

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'To-Do List', 
        todos, 
        categories 
    });
});

// To-Do Routes
app.get('/todos', (req, res) => {
    const { category } = req.query;
    if (category) {
        res.json(todos.filter(todo => todo.category === category));
    } else {
        res.json(todos);
    }
});

app.post('/todos', (req, res) => {
    const todo = req.body;
    todos.push(todo);
    res.status(201).json(todo);
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    let todo = todos.find(t => t.id === id);

    if (todo) {
        Object.assign(todo, updates);
        res.json(todo);
    } else {
        res.status(404).send('To-Do not found');
    }
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    todos = todos.filter(t => t.id !== id);
    res.status(204).send();
});

// Category Routes
app.post('/categories', (req, res) => {
    const category = req.body.name;
    categories.push(category);
    res.status(201).json({ category });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
