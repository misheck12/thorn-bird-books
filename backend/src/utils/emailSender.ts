import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email Templates
export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    items: Array<{
      title: string;
      author: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    currency: string;
  }
) => {
  const subject = `Order Confirmation - ${orderDetails.orderId} - Thorn Bird Books`;
  
  const itemsList = orderDetails.items
    .map(item => `<li>${item.title} by ${item.author} - Qty: ${item.quantity} - ${orderDetails.currency} ${item.price.toFixed(2)}</li>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <header style="background-color: #eab308; color: white; padding: 20px; text-align: center;">
        <h1>Thorn Bird Books</h1>
        <p>Order Confirmation</p>
      </header>
      
      <main style="padding: 20px;">
        <h2>Thank you for your order, ${orderDetails.customerName}!</h2>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h3>Items Ordered:</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${itemsList}
        </ul>
        
        <div style="background-color: #22c55e; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h3>Total: ${orderDetails.currency} ${orderDetails.total.toFixed(2)}</h3>
        </div>
        
        <p>We'll send you another email when your order ships. If you have any questions, please contact us at info@thornbirdbooks.com.</p>
      </main>
      
      <footer style="background-color: #374151; color: white; padding: 20px; text-align: center;">
        <p>&copy; ${new Date().getFullYear()} Thorn Bird Books. All rights reserved.</p>
      </footer>
    </div>
  `;

  const text = `
    Order Confirmation - Thorn Bird Books
    
    Thank you for your order, ${orderDetails.customerName}!
    
    Order ID: ${orderDetails.orderId}
    Order Date: ${new Date().toLocaleDateString()}
    
    Items Ordered:
    ${orderDetails.items.map(item => `- ${item.title} by ${item.author} - Qty: ${item.quantity} - ${orderDetails.currency} ${item.price.toFixed(2)}`).join('\n')}
    
    Total: ${orderDetails.currency} ${orderDetails.total.toFixed(2)}
    
    We'll send you another email when your order ships.
  `;

  return sendEmail(customerEmail, subject, text, html);
};

export const sendEventRegistrationEmail = async (
  customerEmail: string,
  eventDetails: {
    eventId: string;
    customerName: string;
    eventTitle: string;
    eventDate: string;
    location: string;
    ticketType: string;
    price: number;
    currency: string;
  }
) => {
  const subject = `Event Registration Confirmation - ${eventDetails.eventTitle}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <header style="background-color: #eab308; color: white; padding: 20px; text-align: center;">
        <h1>Thorn Bird Books</h1>
        <p>Event Registration Confirmation</p>
      </header>
      
      <main style="padding: 20px;">
        <h2>Welcome to ${eventDetails.eventTitle}!</h2>
        
        <p>Dear ${eventDetails.customerName},</p>
        <p>Thank you for registering for our event. We're excited to see you there!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Event Details</h3>
          <p><strong>Event:</strong> ${eventDetails.eventTitle}</p>
          <p><strong>Date:</strong> ${eventDetails.eventDate}</p>
          <p><strong>Location:</strong> ${eventDetails.location}</p>
          <p><strong>Ticket Type:</strong> ${eventDetails.ticketType}</p>
          ${eventDetails.price > 0 ? `<p><strong>Price:</strong> ${eventDetails.currency} ${eventDetails.price.toFixed(2)}</p>` : '<p><strong>Price:</strong> FREE</p>'}
        </div>
        
        <div style="background-color: #22c55e; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h3>You're Registered!</h3>
          <p>Please bring this confirmation email to the event.</p>
        </div>
        
        <p>If you need to make any changes or have questions, please contact us at events@thornbirdbooks.com.</p>
      </main>
      
      <footer style="background-color: #374151; color: white; padding: 20px; text-align: center;">
        <p>&copy; ${new Date().getFullYear()} Thorn Bird Books. All rights reserved.</p>
      </footer>
    </div>
  `;

  const text = `
    Event Registration Confirmation - Thorn Bird Books
    
    Welcome to ${eventDetails.eventTitle}!
    
    Dear ${eventDetails.customerName},
    Thank you for registering for our event.
    
    Event Details:
    - Event: ${eventDetails.eventTitle}
    - Date: ${eventDetails.eventDate}
    - Location: ${eventDetails.location}
    - Ticket Type: ${eventDetails.ticketType}
    - Price: ${eventDetails.price > 0 ? `${eventDetails.currency} ${eventDetails.price.toFixed(2)}` : 'FREE'}
    
    Please bring this confirmation email to the event.
  `;

  return sendEmail(customerEmail, subject, text, html);
};

export const sendWelcomeEmail = async (customerEmail: string, customerName: string) => {
  const subject = 'Welcome to Thorn Bird Books!';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <header style="background-color: #eab308; color: white; padding: 20px; text-align: center;">
        <h1>Thorn Bird Books</h1>
        <p>Welcome to our literary community!</p>
      </header>
      
      <main style="padding: 20px;">
        <h2>Welcome, ${customerName}!</h2>
        
        <p>Thank you for joining Thorn Bird Books. We're thrilled to have you as part of our literary community!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <ul>
            <li>📚 Browse our extensive book collection</li>
            <li>📅 Register for upcoming literary events</li>
            <li>✍️ Read our latest articles and author interviews</li>
            <li>📧 Stay updated with our newsletter</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/books" 
             style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Exploring Books
          </a>
        </div>
        
        <p>If you have any questions, feel free to reach out to us at info@thornbirdbooks.com.</p>
        
        <p>Happy Reading!</p>
      </main>
      
      <footer style="background-color: #374151; color: white; padding: 20px; text-align: center;">
        <p>&copy; ${new Date().getFullYear()} Thorn Bird Books. All rights reserved.</p>
      </footer>
    </div>
  `;

  const text = `
    Welcome to Thorn Bird Books!
    
    Welcome, ${customerName}!
    
    Thank you for joining Thorn Bird Books. We're thrilled to have you as part of our literary community!
    
    What's Next?
    - Browse our extensive book collection
    - Register for upcoming literary events
    - Read our latest articles and author interviews
    - Stay updated with our newsletter
    
    Visit: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/books
    
    Happy Reading!
  `;

  return sendEmail(customerEmail, subject, text, html);
};
