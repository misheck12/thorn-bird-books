import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import redis from 'redis';

// Create Redis client for distributed rate limiting
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Custom rate limiter store using Redis
class RedisStore {
  private client: any;
  private windowMs: number;

  constructor(windowMs: number) {
    this.client = redisClient;
    this.windowMs = windowMs;
  }

  async increment(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    const windowStart = Math.floor(Date.now() / this.windowMs) * this.windowMs;
    const redisKey = `rate_limit:${key}:${windowStart}`;

    try {
      const current = await this.client.incr(redisKey);
      
      if (current === 1) {
        await this.client.expire(redisKey, Math.ceil(this.windowMs / 1000));
      }

      return {
        totalHits: current,
        resetTime: new Date(windowStart + this.windowMs),
      };
    } catch (error) {
      console.error('Redis rate limiter error:', error);
      // Fallback to allowing request if Redis fails
      return {
        totalHits: 1,
        resetTime: new Date(Date.now() + this.windowMs),
      };
    }
  }

  async decrement(key: string): Promise<void> {
    const windowStart = Math.floor(Date.now() / this.windowMs) * this.windowMs;
    const redisKey = `rate_limit:${key}:${windowStart}`;

    try {
      await this.client.decr(redisKey);
    } catch (error) {
      console.error('Redis rate limiter decrement error:', error);
    }
  }

  async resetKey(key: string): Promise<void> {
    const windowStart = Math.floor(Date.now() / this.windowMs) * this.windowMs;
    const redisKey = `rate_limit:${key}:${windowStart}`;

    try {
      await this.client.del(redisKey);
    } catch (error) {
      console.error('Redis rate limiter reset error:', error);
    }
  }
}

// Different rate limiting tiers
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore(15 * 60 * 1000) as any,
});

export const moderateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore(15 * 60 * 1000) as any,
});

export const laxRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore(15 * 60 * 1000) as any,
});

// Authentication rate limiting
export const authRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 5 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore(5 * 60 * 1000) as any,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Payment processing rate limiting
export const paymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 payment requests per hour
  message: {
    error: 'Too many payment attempts, please try again later.',
    retryAfter: 60 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore(60 * 60 * 1000) as any,
});

// Custom rate limiter with user-based limits
export const userBasedRateLimit = (maxRequests: number, windowMs: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Use user ID if authenticated, otherwise fall back to IP
      const identifier = (req as any).user?.id || req.ip;
      const key = `user_rate_limit:${identifier}`;
      
      const store = new RedisStore(windowMs);
      const result = await store.increment(key);

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - result.totalHits).toString(),
        'X-RateLimit-Reset': result.resetTime.getTime().toString(),
      });

      if (result.totalHits > maxRequests) {
        res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetTime.getTime() - Date.now()) / 1000),
        });
        return;
      }

      next();
    } catch (error) {
      console.error('User-based rate limiter error:', error);
      // Continue on error to avoid blocking users
      next();
    }
  };
};

export { redisClient };