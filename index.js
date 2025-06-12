const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data store
let items = [
  { id: 1, name: 'Item One', description: 'First item' },
  { id: 2, name: 'Item Two', description: 'Second item' }
];

// Root Route
app.get('/', (req, res) => {
  res.send('Hello, world');
});

// GET /items - Get all items
app.get('/items', (req, res) => {
  res.json(items);
});

// GET /items/:id - Get item by ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /items - Create new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1,
    name,
    description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id - Update item by ID
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  item.name = name;
  item.description = description;
  res.json(item);
});

// DELETE /items/:id - Delete item by ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  const deletedItem = items.splice(index, 1);
  res.json({ message: 'Item deleted', item: deletedItem[0] });
});

// 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
