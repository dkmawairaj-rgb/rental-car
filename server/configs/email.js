import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create transporter for sending emails
const createTransporter = () => {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Email credentials not configured. Email notifications will be disabled.');
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const transporter = createTransporter();

// Send booking notification email to owner
export const sendBookingNotificationToOwner = async (bookingData) => {
    // If email is not configured, just log and return
    if (!transporter) {
        console.log('Email notification skipped - email not configured');
        return;
    }

    if (!process.env.OWNER_EMAIL) {
        console.log('Owner email not configured');
        return;
    }

    const { userName, userEmail, mobileNumber, carName, pickupDate, returnDate, price, location } = bookingData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.OWNER_EMAIL,
        subject: `New Booking Request - ${carName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
                    .label { font-weight: bold; color: #333; }
                    .value { color: #666; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }
                    .highlight { background: #FFE5B4; padding: 10px; border-radius: 5px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🚗 New Booking Request Received!</h2>
                    </div>
                    <div class="content">
                        <div class="highlight">
                            <p><strong>Payment Method:</strong> Cash on Pickup</p>
                        </div>

                        <h3>Customer Information:</h3>
                        <div class="info-row">
                            <span class="label">Name:</span> <span class="value">${userName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span> <span class="value">${userEmail}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Mobile Number:</span> <span class="value">${mobileNumber}</span>
                        </div>

                        <h3>Booking Details:</h3>
                        <div class="info-row">
                            <span class="label">Car:</span> <span class="value">${carName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Pickup Location:</span> <span class="value">${location}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Pickup Date:</span> <span class="value">${pickupDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Return Date:</span> <span class="value">${returnDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Total Price:</span> <span class="value" style="font-size: 18px; color: #4CAF50;">₹${price}</span>
                        </div>

                        <div class="footer">
                            <p>Please confirm this booking in your dashboard.</p>
                            <p>The customer will pay in cash upon pickup.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking notification email sent to owner');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

// Send booking confirmation email to user
export const sendBookingConfirmationToUser = async (bookingData) => {
    // If email is not configured, just log and return
    if (!transporter) {
        console.log('Email notification skipped - email not configured');
        return;
    }

    const { userEmail, userName, carName, pickupDate, returnDate, price, location, mobileNumber } = bookingData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Booking Confirmation - ${carName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
                    .label { font-weight: bold; color: #333; }
                    .value { color: #666; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }
                    .status { background: #FFF3CD; padding: 10px; border-radius: 5px; margin: 15px 0; border: 1px solid #FFD700; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>✅ Booking Received Successfully!</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${userName},</p>
                        <p>Thank you for booking with us! Your booking has been received and is pending confirmation.</p>

                        <div class="status">
                            <p><strong>Status:</strong> Pending Confirmation</p>
                            <p><strong>Payment Method:</strong> Cash on Pickup</p>
                        </div>

                        <h3>Your Booking Details:</h3>
                        <div class="info-row">
                            <span class="label">Car:</span> <span class="value">${carName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Pickup Location:</span> <span class="value">${location}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Pickup Date:</span> <span class="value">${pickupDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Return Date:</span> <span class="value">${returnDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Total Price:</span> <span class="value" style="font-size: 18px; color: #2196F3;">₹${price}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Contact Number:</span> <span class="value">${mobileNumber}</span>
                        </div>

                        <div class="footer">
                            <p><strong>Important:</strong></p>
                            <p>• You will receive a confirmation email once the owner approves your booking.</p>
                            <p>• Payment will be collected in cash at the time of pickup.</p>
                            <p>• You can cancel your booking anytime from your dashboard.</p>
                            <p style="margin-top: 20px;">If you have any questions, please contact us.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to user');
    } catch (error) {
        console.error('Error sending email to user:', error.message);
    }
};

// Send booking cancellation notification to owner
export const sendBookingCancellationToOwner = async (bookingData) => {
    // If email is not configured, just log and return
    if (!transporter) {
        console.log('Email notification skipped - email not configured');
        return;
    }

    if (!process.env.OWNER_EMAIL) {
        console.log('Owner email not configured');
        return;
    }

    const { userName, userEmail, carName, pickupDate, returnDate, price, location } = bookingData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.OWNER_EMAIL,
        subject: `Booking Cancelled - ${carName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
                    .label { font-weight: bold; color: #333; }
                    .value { color: #666; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }
                    .cancelled { background: #ffebee; padding: 10px; border-radius: 5px; margin: 15px 0; border: 1px solid #f44336; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>❌ Booking Cancelled</h2>
                    </div>
                    <div class="content">
                        <div class="cancelled">
                            <p><strong>Status:</strong> Cancelled by Customer</p>
                            <p><strong>Action Required:</strong> No action needed - booking has been cancelled</p>
                        </div>

                        <h3>Customer Information:</h3>
                        <div class="info-row">
                            <span class="label">Name:</span> <span class="value">${userName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span> <span class="value">${userEmail}</span>
                        </div>

                        <h3>Cancelled Booking Details:</h3>
                        <div class="info-row">
                            <span class="label">Car:</span> <span class="value">${carName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Pickup Location:</span> <span class="value">${location}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Pickup Date:</span> <span class="value">${pickupDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Return Date:</span> <span class="value">${returnDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Total Price:</span> <span class="value" style="font-size: 18px; color: #f44336;">₹${price}</span>
                        </div>

                        <div class="footer">
                            <p>This booking has been cancelled by the customer.</p>
                            <p>The car is now available for other bookings.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking cancellation email sent to owner');
    } catch (error) {
        console.error('Error sending cancellation email:', error.message);
    }
};

export default transporter;