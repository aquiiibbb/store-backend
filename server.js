const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://store-space-pr3899.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Full error:', err);
  }
};

connectDB();

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Routes
app.use('/api/reservations', require('./src/Routes/routes'));
app.use('/api/tent', require('./src/Routes/tent'));
app.use('/api/un1', require('./src/Routes/un1'));
app.use('/api/un2', require('./src/Routes/un2'));
app.use('/api/un3', require('./src/Routes/un3'));
app.use('/api/un4', require('./src/Routes/un4'));
app.use('/api/un5', require('./src/Routes/un5'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Storage Reservation API running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Diagnostic endpoint
app.get('/api/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      host: mongoose.connection.host || 'not connected',
      name: mongoose.connection.name || 'not connected'
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'not set',
      hasMongoUri: !!process.env.MONGODB_URI,
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasFrontendUrl: !!process.env.FRONTEND_URL
    }
  };
  
  const statusCode = health.mongodb.connected ? 200 : 503;
  res.status(statusCode).json(health);
});

// Test endpoint to check if routes are working
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API routes are working!',
    endpoints: [
      'POST /api/reservations',
      'POST /api/tent',
      'POST /api/un1',
      'POST /api/un2',
      'POST /api/un3',
      'POST /api/un4',
      'POST /api/un5'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
