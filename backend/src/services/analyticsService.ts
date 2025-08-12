import { Request, Response, NextFunction } from 'express';
import CacheService from './cacheService';

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  sessionId?: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface PageView {
  page: string;
  userId?: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  referrer?: string;
  duration?: number;
}

export interface UserAction {
  action: string;
  userId?: string;
  sessionId: string;
  ip: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: CacheService;

  private constructor() {
    this.cache = CacheService.getInstance();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track page views
  async trackPageView(pageView: PageView): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const hour = new Date().getHours();
      
      // Daily page views
      await this.incrementCounter(`analytics:pageviews:${today}`);
      
      // Hourly page views
      await this.incrementCounter(`analytics:pageviews:${today}:${hour}`);
      
      // Page-specific views
      await this.incrementCounter(`analytics:pages:${pageView.page}:${today}`);
      
      // Store recent page views for real-time analytics
      await this.cache.set(
        `analytics:recent:pageview:${Date.now()}`,
        pageView,
        3600 // 1 hour TTL
      );
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Track user actions
  async trackUserAction(action: UserAction): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Daily actions
      await this.incrementCounter(`analytics:actions:${action.action}:${today}`);
      
      // User-specific actions
      if (action.userId) {
        await this.incrementCounter(`analytics:users:${action.userId}:actions:${today}`);
      }
      
      // Store recent actions
      await this.cache.set(
        `analytics:recent:action:${Date.now()}`,
        action,
        3600
      );
    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  }

  // Track events (purchases, registrations, etc.)
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Daily events
      await this.incrementCounter(`analytics:events:${event.event}:${today}`);
      
      // Store event details
      await this.cache.set(
        `analytics:event:${event.event}:${Date.now()}`,
        event,
        7 * 24 * 3600 // 7 days TTL
      );
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Get analytics data for admin dashboard
  async getAnalytics(startDate: string, endDate: string): Promise<any> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const data: any = {
        pageViews: {},
        userActions: {},
        events: {},
        topPages: {},
        summary: {
          totalPageViews: 0,
          totalActions: 0,
          totalEvents: 0,
          uniqueUsers: new Set(),
        }
      };

      // Get data for each day in the range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        // Page views
        const pageViews = await this.getCounter(`analytics:pageviews:${dateStr}`);
        data.pageViews[dateStr] = pageViews;
        data.summary.totalPageViews += pageViews;
      }

      return data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {};
    }
  }

  // Get real-time analytics
  async getRealTimeAnalytics(): Promise<any> {
    try {
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Get recent page views and actions
      const recentData = await this.getRecentActivity(hourAgo);
      
      return {
        activeUsers: recentData.uniqueUsers.size,
        recentPageViews: recentData.pageViews,
        recentActions: recentData.actions,
        timestamp: now.toISOString(),
      };
    } catch (error) {
      console.error('Error getting real-time analytics:', error);
      return {};
    }
  }

  // Helper methods
  private async incrementCounter(key: string, increment: number = 1): Promise<void> {
    try {
      const current = await this.cache.get(key) || 0;
      await this.cache.set(key, current + increment, 30 * 24 * 3600); // 30 days TTL
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  }

  private async getCounter(key: string): Promise<number> {
    try {
      return await this.cache.get(key) || 0;
    } catch (error) {
      console.error('Error getting counter:', error);
      return 0;
    }
  }

  private async getRecentActivity(since: Date): Promise<any> {
    // This would be implemented with proper querying in a production environment
    // For now, return mock data structure
    return {
      uniqueUsers: new Set(),
      pageViews: [],
      actions: [],
    };
  }
}

// Middleware to automatically track page views
export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const analytics = AnalyticsService.getInstance();
  
  // Generate session ID if not exists
  const sessionId = req.headers['x-session-id'] as string || `session_${Date.now()}`;
  
  // Track page view for GET requests
  if (req.method === 'GET' && req.path.startsWith('/api/')) {
    analytics.trackPageView({
      page: req.path,
      userId: (req as any).user?.id,
      sessionId,
      ip: req.ip || req.connection.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date(),
      referrer: req.headers.referer,
    });
  }
  
  next();
};

// Middleware to track specific actions
export const trackAction = (actionName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const analytics = AnalyticsService.getInstance();
    const sessionId = req.headers['x-session-id'] as string || `session_${Date.now()}`;
    
    analytics.trackUserAction({
      action: actionName,
      userId: (req as any).user?.id,
      sessionId,
      ip: req.ip || req.connection.remoteAddress || '',
      timestamp: new Date(),
      data: {
        method: req.method,
        path: req.path,
        body: req.body,
      },
    });
    
    next();
  };
};

export default AnalyticsService;