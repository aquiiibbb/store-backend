const Reservation = require('../model/model');
const { sendReservationEmail, sendAdminNotification } = require('../Config/nodemailers');

const createReservation = async (req, res) => {
  try {
    console.log('Received reservation request:', req.body);
    
    const { email, mobile, firstName, lastName, moveInDate } = req.body;

    // Validate required fields
    if (!email || !mobile || !firstName || !lastName || !moveInDate) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email');
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile.replace(/[^0-9]/g, ''))) {
      console.log('Validation failed: Invalid mobile');
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
      console.log('Validation failed: Past date');
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be in the past'
      });
    }

    console.log('Creating reservation...');
    
    // Create reservation
    const reservation = new Reservation({
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      moveInDate: selectedDate
    });

    await reservation.save();
    console.log('Reservation saved successfully:', reservation._id);

    // Send emails
    try {
      console.log('Sending emails...');
      await Promise.all([
        sendReservationEmail(reservation),
        sendAdminNotification(reservation)
      ]);
      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Don't fail the reservation if email fails
    }

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
    console.error('Reservation error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
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

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createReservation
};
