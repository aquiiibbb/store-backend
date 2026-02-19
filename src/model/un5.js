const mongoose = require('mongoose');

const reservation6Schema = new mongoose.Schema({
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
    default: "12' x 40'"
  },
  monthlyRent: {
    type: Number,
    default: 400
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
    default: 425
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation6', reservation6Schema);