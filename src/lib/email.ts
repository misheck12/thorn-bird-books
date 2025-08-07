import sgMail from '@sendgrid/mail'
import { EmailTemplate, EmailNotification } from '@/types'

interface OrderEmailData {
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  items: Array<{
    book: {
      title: string;
      author: string;
    };
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface WelcomeEmailData {
  name: string;
}

interface PasswordResetEmailData {
  resetUrl: string;
}

interface ShippingEmailData {
  orderNumber: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@thornbirdbooks.com'

export async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    const template = getEmailTemplate(notification.template, notification.data)
    
    const msg = {
      to: notification.to,
      from: FROM_EMAIL,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    await sgMail.send(msg)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

function getEmailTemplate(templateName: string, data: Record<string, unknown>): EmailTemplate {
  switch (templateName) {
    case 'order-confirmation':
      return {
        subject: `Order Confirmation - #${data.orderNumber}`,
        html: generateOrderConfirmationHTML(data),
        text: generateOrderConfirmationText(data),
      }
    
    case 'welcome':
      return {
        subject: 'Welcome to Thorn Bird Books!',
        html: generateWelcomeHTML(data),
        text: generateWelcomeText(data),
      }
    
    case 'password-reset':
      return {
        subject: 'Reset Your Password',
        html: generatePasswordResetHTML(data),
        text: generatePasswordResetText(data),
      }
    
    case 'shipping-notification':
      return {
        subject: `Your Order Has Shipped - #${data.orderNumber}`,
        html: generateShippingHTML(data),
        text: generateShippingText(data),
      }
    
    default:
      throw new Error(`Unknown email template: ${templateName}`)
  }
}

function generateOrderConfirmationHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .order-details { margin: 20px 0; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
        .total { font-weight: bold; font-size: 18px; margin-top: 20px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        <div class="order-details">
          <h2>Order #${data.orderNumber}</h2>
          <p><strong>Date:</strong> ${new Date(data.orderDate).toLocaleDateString()}</p>
          <p><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>
          
          <h3>Items Ordered:</h3>
          ${data.items.map((item) => `
            <div class="item">
              <span>${item.book.title} by ${item.book.author} (Qty: ${item.quantity})</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          
          <div class="total">
            Total: $${data.totalAmount.toFixed(2)}
          </div>
          
          <h3>Shipping Address:</h3>
          <p>
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
            ${data.shippingAddress.country}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateOrderConfirmationText(data: OrderEmailData): string {
  return `
    Order Confirmation - Thank you for your order!
    
    Order #${data.orderNumber}
    Date: ${new Date(data.orderDate).toLocaleDateString()}
    Total: $${data.totalAmount.toFixed(2)}
    
    Items Ordered:
    ${data.items.map((item) => 
      `${item.book.title} by ${item.book.author} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}
    
    Total: $${data.totalAmount.toFixed(2)}
    
    Shipping Address:
    ${data.shippingAddress.street}
    ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
    ${data.shippingAddress.country}
  `
}

function generateWelcomeHTML(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Thorn Bird Books</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .cta { background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Thorn Bird Books!</h1>
        </div>
        <div>
          <p>Hello ${data.name},</p>
          <p>Welcome to Thorn Bird Books! We're excited to have you join our community of book lovers.</p>
          <p>Discover thousands of books across all genres, from bestsellers to hidden gems.</p>
          <a href="${process.env.APP_URL}" class="cta">Start Shopping</a>
          <p>Happy reading!</p>
          <p>The Thorn Bird Books Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateWelcomeText(data: WelcomeEmailData): string {
  return `
    Welcome to Thorn Bird Books!
    
    Hello ${data.name},
    
    Welcome to Thorn Bird Books! We're excited to have you join our community of book lovers.
    
    Discover thousands of books across all genres, from bestsellers to hidden gems.
    
    Visit us at ${process.env.APP_URL} to start shopping.
    
    Happy reading!
    The Thorn Bird Books Team
  `
}

function generatePasswordResetHTML(data: PasswordResetEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .cta { background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${data.resetUrl}" class="cta">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generatePasswordResetText(data: PasswordResetEmailData): string {
  return `
    Password Reset Request
    
    Hello,
    
    You requested to reset your password. Visit the following link to reset it:
    ${data.resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
  `
}

function generateShippingHTML(data: ShippingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Shipped</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .tracking { background-color: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 4px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Shipped!</h1>
        </div>
        <div>
          <p>Good news! Your order #${data.orderNumber} has been shipped and is on its way to you.</p>
          <div class="tracking">
            <strong>Tracking Number: ${data.trackingNumber}</strong>
          </div>
          <p>You can track your package using the tracking number above.</p>
          <p>Expected delivery: ${data.estimatedDelivery}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateShippingText(data: ShippingEmailData): string {
  return `
    Your Order Has Shipped!
    
    Good news! Your order #${data.orderNumber} has been shipped and is on its way to you.
    
    Tracking Number: ${data.trackingNumber}
    
    You can track your package using the tracking number above.
    
    Expected delivery: ${data.estimatedDelivery}
  `
}