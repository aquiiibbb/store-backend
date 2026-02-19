const Reservation = require('../model/un3');
const { sendReservationEmail, sendAdminNotification } = require('../Config/nodemailers');

const createReservation4 = async (req, res) => {
  try {
    const { email, mobile, firstName, lastName, moveInDate } = req.body;

    if (!email || !mobile || !firstName || !lastName || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile.replace(/[^0-9]/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number'
      });
    }

    const selectedDate = new Date(moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be in the past'
      });
    }

    const reservation = new Reservation({
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      moveInDate: selectedDate
    });

    await reservation.save();

    try {
      await Promise.all([
        sendReservationEmail(reservation),
        sendAdminNotification(reservation)
      ]);
    } catch (emailError) {
      console.error('Email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully!',
      data: {
        id: reservation._id,
        email: reservation.email,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        moveInDate: reservation.moveInDate
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
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
  createReservation4
};
