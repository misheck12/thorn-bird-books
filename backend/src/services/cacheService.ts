import { redisClient } from '../middleware/rateLimiter';
import { Request, Response, NextFunction } from 'express';

export class CacheService {
  private static instance: CacheService;
  private client: any;

  private constructor() {
    this.client = redisClient;
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }
}

// Cache middleware for GET requests
export const cacheMiddleware = (ttlSeconds: number = 3600, keyPrefix?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cache = CacheService.getInstance();
    const cacheKey = `${keyPrefix || 'api'}:${req.originalUrl}:${JSON.stringify(req.query)}`;

    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        // Add cache hit header
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache the response
      res.json = function(data: any) {
        // Cache the response
        cache.set(cacheKey, data, ttlSeconds);
        
        // Add cache miss header
        res.set('X-Cache', 'MISS');
        
        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Specific cache utilities for different endpoints
export const BooksCacheService = {
  getBooksListKey: (query: any) => `books:list:${JSON.stringify(query)}`,
  getBookDetailKey: (id: string) => `books:detail:${id}`,
  getFeaturedBooksKey: () => 'books:featured',
  invalidateBookCache: async (bookId?: string) => {
    const cache = CacheService.getInstance();
    await cache.invalidatePattern('books:list:*');
    await cache.del('books:featured');
    if (bookId) {
      await cache.del(`books:detail:${bookId}`);
    }
  }
};

export const EventsCacheService = {
  getEventsListKey: (query: any) => `events:list:${JSON.stringify(query)}`,
  getEventDetailKey: (id: string) => `events:detail:${id}`,
  getUpcomingEventsKey: () => 'events:upcoming',
  invalidateEventCache: async (eventId?: string) => {
    const cache = CacheService.getInstance();
    await cache.invalidatePattern('events:list:*');
    await cache.del('events:upcoming');
    if (eventId) {
      await cache.del(`events:detail:${eventId}`);
    }
  }
};

export const UsersCacheService = {
  getUserProfileKey: (id: string) => `users:profile:${id}`,
  invalidateUserCache: async (userId: string) => {
    const cache = CacheService.getInstance();
    await cache.del(`users:profile:${userId}`);
  }
};

export default CacheService;