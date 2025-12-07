const sgMail = require('@sendgrid/mail');

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email template for booking confirmation
const createBookingEmailTemplate = (bookingData) => {
  const { user, show, seats, totalAmount, _id } = bookingData;
  
  // Add defensive checks and logging
  console.log('Creating email template for booking:', _id);
  console.log('Show data:', show);
  
  const movie = show?.movie || {};
  const theatre = show?.theatre || {};
  
  // Get movie details
  const movieName = movie.name || movie.title || 'Movie Information Not Available';
  const moviePoster = movie.poster || movie.posterUrl || '';
  
  console.log('Movie name:', movieName);
  console.log('Movie poster:', moviePoster);
  
  // Format date and time
  const showDate = show?.date ? new Date(show.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date not available';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 30px 20px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .movie-banner {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-bottom: 2px solid #e9ecef;
        }
        .movie-poster {
          max-width: 200px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin-bottom: 15px;
        }
        .movie-title {
          font-size: 22px;
          font-weight: 700;
          color: #212529;
          margin: 10px 0;
        }
        .content { 
          padding: 30px 20px;
          background-color: #ffffff;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .ticket-details { 
          background-color: #f8f9fa; 
          padding: 25px; 
          margin: 20px 0; 
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .section-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: #212529;
          font-size: 18px;
          font-weight: 600;
        }
        .detail-row { 
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label { 
          font-weight: 600; 
          color: #495057;
          min-width: 140px;
        }
        .label::after {
          content: ':';
          margin-left: 4px;
        }
        .value {
          flex: 1;
          text-align: right;
          color: #212529;
          word-break: break-word;
        }
        .total-row {
          border-top: 2px solid #dee2e6;
          margin-top: 15px;
          padding-top: 15px;
          font-size: 18px;
        }
        .total-amount {
          font-weight: 700;
          color: #667eea;
          font-size: 20px;
        }
        .info-box {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-box strong {
          color: #856404;
        }
        .footer { 
          text-align: center; 
          padding: 25px 20px;
          background-color: #f8f9fa;
          border-top: 1px solid #dee2e6;
        }
        .footer p {
          margin: 8px 0;
          font-size: 13px;
          color: #6c757d;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .company-info {
          font-size: 12px;
          color: #868e96;
          margin-top: 15px;
          line-height: 1.8;
        }
        @media only screen and (max-width: 600px) {
          .detail-row {
            flex-direction: column;
          }
          .value {
            text-align: left;
            margin-top: 4px;
          }
          .label {
            min-width: auto;
          }
          .movie-poster {
            max-width: 150px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>🎬 Booking Confirmed</h1>
        </div>
        
        ${moviePoster ? `
        <div class="movie-banner">
          <img src="${moviePoster}" alt="${movieName}" class="movie-poster" />
          <div class="movie-title">${movieName}</div>
        </div>
        ` : `
        <div class="movie-banner">
          <div class="movie-title">${movieName}</div>
        </div>
        `}
        
        <div class="content">
          <div class="greeting">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Thank you for booking with Cine-Pass. Your movie tickets have been successfully confirmed.</p>
          </div>
          
          <div class="ticket-details">
            <h2 class="section-title">Booking Details</h2>
            
            <div class="detail-row">
              <span class="label">Booking ID</span>
              <span class="value">${_id}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Movie</span>
              <span class="value">${movieName}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Theatre</span>
              <span class="value">${theatre.name || 'Theatre information not available'}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Show Date</span>
              <span class="value">${showDate}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Show Time</span>
              <span class="value">${show?.time || 'Time not available'}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Seats</span>
              <span class="value">${seats.sort((a, b) => a - b).join(', ')}</span>
            </div>
            
            <div class="detail-row total-row">
              <span class="label">Total Amount</span>
              <span class="value total-amount">₹${totalAmount}</span>
            </div>
          </div>
          
          <div class="info-box">
            <strong>Important Reminder:</strong> Please arrive at the theatre at least 15 minutes before the show time. Carry a valid ID for verification at the entrance.
          </div>
          
          <p style="margin-top: 25px; font-size: 15px;">If you have any questions about your booking, feel free to reply to this email. Our support team is here to help.</p>
          
          <p style="font-size: 16px; font-weight: 600; color: #667eea;">Enjoy your movie! 🍿</p>
        </div>
        
        <div class="footer">
          <p style="font-weight: 600; font-size: 15px; color: #495057;">Cine-Pass</p>
          <p>Your Movie Ticket Booking Platform</p>
          <p style="margin-top: 15px;">
            Need help? Contact us at <a href="mailto:${process.env.SENDGRID_FROM_EMAIL}">${process.env.SENDGRID_FROM_EMAIL}</a>
          </p>
          <div class="company-info">
            <p>This is an automated confirmation email for your ticket booking.</p>
            <p>You received this email because you completed a transaction on Cine-Pass.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
BOOKING CONFIRMATION

Hello ${user.name},

Thank you for booking with Cine-Pass. Your movie tickets have been successfully confirmed.

BOOKING DETAILS
----------------------------------------
Booking ID: ${_id}
Movie: ${movieName}
Theatre: ${theatre.name || 'Theatre information not available'}
Show Date: ${showDate}
Show Time: ${show?.time || 'Time not available'}
Seats: ${seats.sort((a, b) => a - b).join(', ')}
----------------------------------------
Total Amount: ₹${totalAmount}

IMPORTANT REMINDER: Please arrive at the theatre at least 15 minutes before the show time. Carry a valid ID for verification at the entrance.

If you have any questions about your booking, feel free to reply to this email. Our support team is here to help.

Enjoy your movie!

---
Cine-Pass - Your Movie Ticket Booking Platform

Need help? Contact us at ${process.env.SENDGRID_FROM_EMAIL}

This is an automated confirmation email for your ticket booking.
You received this email because you completed a transaction on Cine-Pass.
  `;

  return { html, text };
};

// Function to send booking confirmation email using SendGrid
const sendBookingConfirmationEmail = async (bookingData) => {
  try {
    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user } = bookingData;
    
    if (!user || !user.email) {
      console.error('User email not found in booking data');
      return { success: false, message: 'User email not found' };
    }

    const { html, text } = createBookingEmailTemplate(bookingData);

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER,
      subject: 'Booking Confirmation - Cine-Pass',
      text: text,
      html: html,
      categories: ['booking-confirmation'],
      customArgs: {
        bookingId: bookingData._id.toString()
      }
    };

    const response = await sgMail.send(msg);
    console.log('Booking confirmation email sent via SendGrid');
    
    return { success: true, messageId: response[0].headers['x-message-id'] };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
};
