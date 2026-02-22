const Reservation = require('../model/model');
const { sendReservationEmail, sendAdminNotification } = require('../Config/nodemailers');

/**
 * Create a new reservation
 * @route POST /api/reservations
 */
const createReservation = async (req, res) => {
  try {
    const { email, mobile, firstName, lastName, moveInDate } = req.body;

    // ============================================
    // 1. VALIDATE REQUIRED FIELDS
    // ============================================
    if (!email || !mobile || !firstName || !lastName || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // ============================================
    // 2. SANITIZE INPUTS
    // ============================================
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedMobile = mobile.trim().replace(/\s+/g, '');
    const sanitizedFirstName = firstName.trim().replace(/[^a-zA-Z\s]/g, '');
    const sanitizedLastName = lastName.trim().replace(/[^a-zA-Z\s]/g, '');

    // ============================================
    // 3. EMAIL VALIDATION
    // ============================================
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // ============================================
    // 4. MOBILE VALIDATION
    // ============================================
    const mobileRegex = /^[+]?[0-9]{10,15}$/;
    if (!mobileRegex.test(sanitizedMobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number (10-15 digits)'
      });
    }

    // ============================================
    // 5. NAME VALIDATION
    // ============================================
    if (sanitizedFirstName.length < 2 || sanitizedLastName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name must be at least 2 characters'
      });
    }

    if (sanitizedFirstName.length > 50 || sanitizedLastName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Names cannot exceed 50 characters'
      });
    }

    // ============================================
    // 6. DATE VALIDATION
    // ============================================
    const selectedDate = new Date(moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is valid
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Check if date is in the past
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be in the past'
      });
    }

    // Check if date is too far in the future (max 1 year)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    if (selectedDate > maxDate) {
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be more than 1 year in the future'
      });
    }

    // ============================================
    // 7. CHECK FOR DUPLICATE EMAIL
    // ============================================
    const existingEmail = await Reservation.findOne({
      email: sanitizedEmail
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'A reservation with this email already exists'
      });
    }

    // ============================================
    // 8. CHECK FOR DUPLICATE MOBILE
    // ============================================
    const existingMobile = await Reservation.findOne({
      mobile: sanitizedMobile
    });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: 'A reservation with this mobile number already exists'
      });
    }

    // ============================================
    // 9. CREATE RESERVATION
    // ============================================
    const reservation = new Reservation({
      email: sanitizedEmail,
      mobile: sanitizedMobile,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      moveInDate: selectedDate,
      spaceNumber: '#3008',  // ✅ FIXED: Changed from SpaceNumber to spaceNumber
      spaceSize: "10' x 10'",
      monthlyRent: 170,
      adminFee: 25,
      securityDeposit: 50,
      totalCost: 195
    });

    await reservation.save();

    // ============================================
    // 10. SEND EMAILS (NON-BLOCKING)
    // ============================================
    let emailStatus = { customer: false, admin: false };

    try {
      const [customerEmail, adminEmail] = await Promise.allSettled([
        sendReservationEmail(reservation),
        sendAdminNotification(reservation)
      ]);

      emailStatus.customer = customerEmail.status === 'fulfilled';
      emailStatus.admin = adminEmail.status === 'fulfilled';

      // Log email failures
      if (customerEmail.status === 'rejected') {
        console.error('❌ Customer email failed:', customerEmail.reason);
      } else {
        console.log('✅ Customer email sent successfully');
      }

      if (adminEmail.status === 'rejected') {
        console.error('❌ Admin email failed:', adminEmail.reason);
      } else {
        console.log('✅ Admin email sent successfully');
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    // ============================================
    // 11. SEND SUCCESS RESPONSE
    // ============================================
    let message = 'Reservation created successfully!';
    if (emailStatus.customer) {
      message += ' Check your email for confirmation.';
    } else {
      message += ' However, confirmation email could not be sent. Please contact support.';
    }

    console.log(`✅ Reservation created: ${reservation._id} for ${sanitizedEmail}`);

    res.status(201).json({
      success: true,
      message,
      data: {
        id: reservation._id,
        email: reservation.email,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        moveInDate: reservation.moveInDate,
        spaceNumber: reservation.spaceNumber,  // ✅ Now this will work correctly
        totalCost: reservation.totalCost,
        monthlyRent: reservation.monthlyRent,
        adminFee: reservation.adminFee,
        securityDeposit: reservation.securityDeposit
      }
    });

  } catch (error) {
    console.error('❌ Reservation error:', error);
    console.error('❌ Error stack:', error.stack);  // ✅ ADDED: Better error logging

    // ============================================
    // 12. ERROR HANDLING
    // ============================================

    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `A reservation with this ${field} already exists`
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined  // ✅ ADDED: Show error in dev mode
    });
  }
};

module.exports = {
  createReservation
};
