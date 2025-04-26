const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));  // << Correct

// Products
const products = [
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Phone', price: 500 }
];

// Temporary storage
let cart = [];
let orders = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// 1. Add to Cart
app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  cart.push({ productId, quantity });
  res.json({ message: 'Product added to cart successfully', cart });
});

// 2. Checkout
app.post('/checkout', (req, res) => {
  if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product.price * item.quantity);
  }, 0);

  const newOrder = {
    id: orders.length + 1,
    items: [...cart],
    totalAmount: total,
    orderDate: new Date()
  };

  orders.push(newOrder);
  cart = []; // Clear cart

  res.status(201).json({ message: 'Checkout successful', order: newOrder });
});

// 3. Get All Orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// 4. Get specific Order by ID
app.get('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) return res.status(404).json({ error:` Order with ID ${id} not found.` });

  res.json(order);
});

// 5. Delete Order by ID
app.delete('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) return res.status(404).json({ error:` Order with ID ${id} not found.` });

  orders.splice(index, 1);
  res.json({ message:` Order with ID ${id} deleted successfully. `});
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});