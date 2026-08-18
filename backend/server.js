require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
const FRONTEND_PATH = process.env.FRONTEND_PATH
  ? path.resolve(process.env.FRONTEND_PATH)
  : path.join(__dirname, '..', 'frontend');

// ---- Core middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---- API routes ----
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// ---- Static frontend ----
app.use(express.static(FRONTEND_PATH));

// Fallback: send index.html for the root and unknown non-API GET routes so
// that direct navigation to pages like /product.html?id=... works normally.
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'), (err) => {
    if (err) next();
  });
});

// ---- 404 handler for unmatched API routes ----
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// ---- Global error handler ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ---- Connect to MongoDB, then start the server ----
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB at', MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
