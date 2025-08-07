import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private static fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@thornbirdbooks.com';

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log('SendGrid not configured, email would be sent:', options);
        return true; // Return true in development
      }

      const msg = {
        to: options.to,
        from: options.from || this.fromEmail,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await sgMail.send(msg);
      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3730a3); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Thorn Bird Books!</h1>
        </div>
        <div style="padding: 40px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
          <p style="font-size: 16px; color: #374151;">
            Thank you for joining our literary community! We're excited to help you discover your next great read.
          </p>
          <p style="font-size: 16px; color: #374151;">
            Explore our vast collection of books, join our events, and connect with fellow book lovers.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thornbirdbooks.com/books" 
               style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Browse Books
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            Happy reading!<br>
            The Thorn Bird Books Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Thorn Bird Books!',
      html,
      text: `Dear ${name}, Thank you for joining our literary community! Explore our books at https://thornbirdbooks.com/books`
    });
  }

  static async sendOrderConfirmation(email: string, orderDetails: {
    orderNumber: string;
    total: number;
    status: string;
  }): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmation</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">
            Thank you for your order! We're preparing your books for shipment.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Order #${orderDetails.orderNumber}</h3>
            <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${orderDetails.status}</p>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            We'll send you tracking information once your order ships.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Order Confirmation - #${orderDetails.orderNumber}`,
      html,
      text: `Thank you for your order #${orderDetails.orderNumber}. Total: $${orderDetails.total.toFixed(2)}`
    });
  }

  static async sendNewsletterEmail(email: string, subject: string, content: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thorn Bird Books</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          ${content}
          <div style="text-align: center; margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              You're receiving this email because you subscribed to our newsletter.
              <a href="https://thornbirdbooks.com/unsubscribe" style="color: #1e40af;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: content.replace(/<[^>]*>/g, '') // Strip HTML for text version
    });
  }
}