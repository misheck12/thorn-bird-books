import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';

// Mock newsletter storage (in production, this would be in a database)
const newsletterSubscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    if (newsletterSubscribers.has(email)) {
      return NextResponse.json(
        { success: false, error: 'Email is already subscribed' },
        { status: 409 }
      );
    }

    // Add to newsletter list
    newsletterSubscribers.add(email);

    // Send welcome email
    await EmailService.sendWelcomeEmail(email, name || 'Book Lover');

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      subscriberCount: newsletterSubscribers.size
    });
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get subscriber count' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Remove from newsletter list
    const wasRemoved = newsletterSubscribers.delete(email);

    if (!wasRemoved) {
      return NextResponse.json(
        { success: false, error: 'Email not found in subscription list' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}