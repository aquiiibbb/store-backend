const mongoose = require('mongoose');

const reservation5Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  moveInDate: {
    type: Date,
    required: true
  },
  spaceNumber: {
    type: String,
    default: '#3008'
  },
  spaceSize: {
    type: String,
    default: "12' x 35'"
  },
  monthlyRent: {
    type: Number,
    default: 350
  },
  adminFee: {
    type: Number,
    default: 25
  },
  securityDeposit: {
    type: Number,
    default: 50
  },
  totalCost: {
    type: Number,
    default: 375
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation5', reservation5Schema);