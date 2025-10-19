# Email Notification Setup for CarRental App

This guide will help you set up email notifications for your CarRental application. The app uses Nodemailer with Gmail for sending booking notifications.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. Node.js installed

## Installation

1. **Install Nodemailer** (if not already installed):
```bash
cd server
npm install nodemailer
```

## Gmail Configuration

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** section
3. Under "Signing in to Google", enable **2-Step Verification**
4. Follow the prompts to set it up

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security** settings
2. Under "Signing in to Google", select **App passwords**
3. Select **Mail** from the dropdown
4. Select **Other (Custom name)** for device
5. Enter "CarRental App" as the name
6. Click **Generate**
7. **Copy the 16-character password** (you won't be able to see it again!)

## Environment Variables Setup

Add these variables to your `server/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com        # Your Gmail address
EMAIL_PASS=xxxx xxxx xxxx xxxx         # The 16-character app password (without spaces)
OWNER_EMAIL=owner-email@gmail.com      # Email where owner receives booking notifications
```

**Example:**
```env
EMAIL_USER=carrentalapp@gmail.com
EMAIL_PASS=abcd1234efgh5678
OWNER_EMAIL=owner@carrental.com
```

## Features Implemented

### 1. Booking Notifications

When a user books a car, the system sends:

- **Email to Owner**: Contains customer details, mobile number, booking dates, and payment info
- **Email to User**: Booking confirmation with all details

### 2. Mobile Number Collection

- Users must provide a mobile number when booking
- Mobile number is stored with the booking
- Displayed to owner in the Manage Bookings dashboard

### 3. Booking Cancellation

- Users can cancel their own bookings from "My Bookings" page
- Cancel button appears for non-cancelled bookings

## Testing the Setup

1. **Start the server**:
```bash
cd server
npm run server
```

2. **Check console output**:
   - If email is configured correctly: You'll see "Booking notification email sent" messages
   - If not configured: You'll see "Email credentials not configured" message

3. **Test a booking**:
   - Create a test booking from the frontend
   - Check both owner and user email addresses

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**:
   - Make sure you're using the App Password, not your regular Gmail password
   - Verify the email address is correct
   - Check that 2FA is enabled

2. **Emails not sending**:
   - Check your `.env` file has correct values
   - Ensure no typos in environment variable names
   - Restart the server after changing `.env` file

3. **"Email credentials not configured" message**:
   - This means EMAIL_USER or EMAIL_PASS is missing from `.env`
   - The app will work but without email notifications

### Security Notes:

- **NEVER** commit your `.env` file to git
- Keep your App Password secure
- Consider using a dedicated email account for the application
- For production, consider using professional email services like SendGrid or AWS SES

## Alternative Email Services

If you don't want to use Gmail, you can modify `server/configs/email.js` to use other services:

### Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

### Custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.yourdomain.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## Production Considerations

For production deployment:

1. Use environment-specific email configurations
2. Implement rate limiting to prevent email spam
3. Add email templates for better formatting
4. Consider using email queuing systems
5. Implement retry logic for failed emails
6. Log email sending activities

## Support

If emails are not critical for your testing, the app will work without email configuration. The system will simply log messages to console instead of sending emails.