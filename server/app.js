'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

// Import routes
let authRoutes;
try {
  authRoutes = require('./routes/auth.routes');
  console.log('✓ Auth routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading auth routes:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes - Phải đặt TRƯỚC notFound middleware
app.use('/api/auth', authRoutes);
console.log('✓ API routes registered: /api/auth');

// Debug middleware để log tất cả requests
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();

module.exports = app;