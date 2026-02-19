const Reservation = require('../model/model');
const { sendReservationEmail, sendAdminNotification } = require('../Config/nodemailers');

const createReservation = async (req, res) => {
  try {
    const { email, mobile, firstName, lastName, moveInDate } = req.body;

    // Validate required fields
    if (!email || !mobile || !firstName || !lastName || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile.replace(/[^0-9]/g, ''))) {
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
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be in the past'
      });
    }

    // Create reservation
    const reservation = new Reservation({
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      moveInDate: selectedDate
    });

    await reservation.save();

    // Send emails
    try {
      await Promise.all([
        sendReservationEmail(reservation),
        sendAdminNotification(reservation)
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully! Check your email for confirmation.',
      data: {
        id: reservation._id,
        email: reservation.email,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        moveInDate: reservation.moveInDate,
        spaceNumber: reservation.spaceNumber,
        totalCost: reservation.totalCost
      }
    });

  } catch (error) {
    console.error('Reservation error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A reservation with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  createReservation
};
