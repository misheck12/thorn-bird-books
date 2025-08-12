// Frontend Analytics Service
interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  properties?: Record<string, any>;
}

interface PageViewEvent {
  page: string;
  title: string;
  url?: string;
  userId?: string;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isGoogleAnalyticsLoaded = false;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeGoogleAnalytics();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeGoogleAnalytics(): void {
    const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
    
    if (!GA_TRACKING_ID || typeof window === 'undefined') {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'session_id',
      },
    });

    this.isGoogleAnalyticsLoaded = true;
  }

  // Track page views
  trackPageView(data: PageViewEvent): void {
    try {
      // Send to Google Analytics
      if (this.isGoogleAnalyticsLoaded && (window as any).gtag) {
        (window as any).gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
          page_title: data.title,
          page_location: data.url || window.location.href,
          custom_parameter_1: this.sessionId,
          user_id: data.userId,
        });
      }

      // Send to our backend analytics
      this.sendToBackend('pageview', {
        ...data,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Track custom events
  trackEvent(data: AnalyticsEvent): void {
    try {
      // Send to Google Analytics
      if (this.isGoogleAnalyticsLoaded && (window as any).gtag) {
        (window as any).gtag('event', data.event, {
          event_category: data.category,
          event_label: data.label,
          value: data.value,
          custom_parameter_1: this.sessionId,
          user_id: data.userId,
          ...data.properties,
        });
      }

      // Send to our backend analytics
      this.sendToBackend('event', {
        ...data,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Track user actions
  trackUserAction(action: string, properties?: Record<string, any>): void {
    this.trackEvent({
      event: 'user_action',
      category: 'user_interaction',
      label: action,
      properties: {
        action,
        ...properties,
      },
    });
  }

  // Track e-commerce events
  trackPurchase(transactionId: string, items: any[], value: number): void {
    try {
      // Send to Google Analytics (Enhanced E-commerce)
      if (this.isGoogleAnalyticsLoaded && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: value,
          currency: 'USD',
          items: items.map(item => ({
            item_id: item.id,
            item_name: item.title,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }

      // Send to backend
      this.sendToBackend('purchase', {
        transactionId,
        items,
        value,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error tracking purchase:', error);
    }
  }

  // Track book views
  trackBookView(bookId: string, bookTitle: string, category?: string): void {
    this.trackEvent({
      event: 'view_item',
      category: 'book_interaction',
      label: bookTitle,
      properties: {
        item_id: bookId,
        item_name: bookTitle,
        item_category: category,
      },
    });
  }

  // Track add to cart
  trackAddToCart(bookId: string, bookTitle: string, price: number, quantity: number = 1): void {
    try {
      if (this.isGoogleAnalyticsLoaded && (window as any).gtag) {
        (window as any).gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: price * quantity,
          items: [{
            item_id: bookId,
            item_name: bookTitle,
            quantity: quantity,
            price: price,
          }],
        });
      }

      this.trackUserAction('add_to_cart', {
        bookId,
        bookTitle,
        price,
        quantity,
      });
    } catch (error) {
      console.error('Error tracking add to cart:', error);
    }
  }

  // Track search
  trackSearch(searchTerm: string, category?: string): void {
    this.trackEvent({
      event: 'search',
      category: 'site_search',
      label: searchTerm,
      properties: {
        search_term: searchTerm,
        search_category: category,
      },
    });
  }

  // Send data to backend analytics
  private async sendToBackend(type: string, data: any): Promise<void> {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({
          type,
          data,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to send analytics to backend');
      }
    } catch (error) {
      // Silent fail for analytics to not disrupt user experience
      console.warn('Analytics backend error:', error);
    }
  }

  // Set user ID for tracking
  setUserId(userId: string): void {
    try {
      if (this.isGoogleAnalyticsLoaded && (window as any).gtag) {
        (window as any).gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
          user_id: userId,
        });
      }
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  // Get session ID
  getSessionId(): string {
    return this.sessionId;
  }
}

export default AnalyticsService;