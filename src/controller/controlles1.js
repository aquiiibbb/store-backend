const Reservation = require('../model/tent');
const { sendReservationEmail, sendAdminNotification } = require('../Config/nodemailers');
const mongoose = require('mongoose');

const createReservation1 = async (req, res) => {
  try {
    console.log('=== Tent Reservation Request Started ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // Check MongoDB connection first
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected! State:', mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please contact support.',
        debug: process.env.NODE_ENV === 'development' ? {
          mongoState: mongoose.connection.readyState,
          hasMongoUri: !!process.env.MONGODB_URI
        } : undefined
      });
    }
    
    const { email, mobile, firstName, lastName, moveInDate } = req.body;

    // Validate required fields
    if (!email || !mobile || !firstName || !lastName || !moveInDate) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: Invalid email');
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile.replace(/[^0-9]/g, ''))) {
      console.log('❌ Validation failed: Invalid mobile');
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number'
      });
    }

    // Date validation
    const selectedDate = new Date(moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      console.log('❌ Validation failed: Past date');
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be in the past'
      });
    }

    console.log('✅ All validations passed');
    console.log('📝 Creating tent reservation...');
    
    // Create reservation
    const reservation = new Reservation({
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      moveInDate: selectedDate
    });

    console.log('💾 Saving to database...');
    await reservation.save();
    console.log('✅ Tent reservation saved successfully:', reservation._id);

    // Send emails
    try {
      console.log('📧 Sending emails...');
      await Promise.all([
        sendReservationEmail(reservation),
        sendAdminNotification(reservation)
      ]);
      console.log('✅ Emails sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    console.log('=== Tent Reservation Request Completed Successfully ===');
    
    return res.status(201).json({
      success: true,
      message: 'Reservation created successfully! Check your email for confirmation.',
      data: {
        id: reservation._id,
        email: reservation.email,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        moveInDate: reservation.moveInDate,
        spaceNumber: reservation.spaceNumber,
        spaceSize: reservation.spaceSize,
        monthlyRent: reservation.monthlyRent,
        totalCost: reservation.totalCost
      }
    });

  } catch (error) {
    console.error('=== Tent Reservation Request Failed ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A reservation with this email already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }

    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Database error. Please try again later or contact support.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
};

module.exports = {
  createReservation1
};
