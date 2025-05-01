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
  {
  "id": 1,
  "name": "Samsung Galaxy S23",
  "price": 69999,
  "category": "Mobiles",
  "image": "https://example.com/s23.jpg",
  "description": "128GB, Phantom Black, 50MP Camera"
},
  {
  "id": 2,
  "name": "Men's Denim Jacket",
  "price": 1999,
  "category": "Clothing",
  "image": "https://example.com/jacket.jpg",
  "description": "Stylish Blue Denim Jacket for Men"
},
  {
  "id": 3,
  "name": "LG 260L Refrigerator",
  "price": 24999,
  "category": "Appliances",
  "image": "https://example.com/fridge.jpg",
  "description": "Smart Inverter, Double Door"
},
  {
  "id": 4,
  "name": "Atomic Habits by James Clear",
  "price": 499,
  "category": "Books",
  "image": "https://example.com/atomic-habits.jpg
  "description": "Build good habits and break bad ones"
},
{
  "id": 5,
  "name": "LEGO Classic Bricks",
  "price": 1499,
  "category": "Toys",
  "image": "https://example.com/lego.jpg",
  "description": "500 pieces of colorful building blocks"
} 
];

// Temporary storage{
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
