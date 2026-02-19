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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
