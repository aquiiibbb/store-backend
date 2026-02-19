const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
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

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Storage Reservation API running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
