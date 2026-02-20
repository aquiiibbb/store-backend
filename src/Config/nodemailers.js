const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReservationEmail = async (reservationData) => {
  const { email, firstName, lastName, moveInDate, spaceNumber, spaceSize, totalCost, monthlyRent, adminFee, securityDeposit } = reservationData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'CINDERELLA SELF ONLINE STORAGE',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reservation Confirmation</h2>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for your reservation! Here are your details:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">CINDERELLA SELF ONLINE STORAGE</h3>
          <p><strong>Address:</strong> 110 San Felipe rd, Hollister, CA 95023</p>
          <p><strong>Phone:</strong> +1 (831) 637-5761</p>
          
          <hr style="margin: 20px 0;">
          
          <p><strong>Space:</strong> ${spaceNumber} (${spaceSize})</p>
          <p><strong>Monthly Rent:</strong> $${monthlyRent}</p> 
          <P><strong>Admin Fee:</strong> $${adminFee}</p>
          <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toLocaleDateString()}</p>
          <p><strong>Total Cost:</strong> $${totalCost}</p>
          <p><strong>Security Deposit:</strong> $${securityDeposit}</p>
        </div>
        
       
        <p>Best regards,<br>Cinderella Self Storage Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendAdminNotification = async (reservationData) => {
  const { email, firstName, lastName, mobile, moveInDate, spaceNumber } = reservationData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Storage Reservation',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Reservation Alert</h2>
        <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Space:</strong> ${spaceNumber}</p>
        <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendReservationEmail, sendAdminNotification };