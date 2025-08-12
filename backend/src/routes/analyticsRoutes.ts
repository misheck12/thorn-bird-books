import express from 'express';
import { protect, authorize } from '../middleware/auth';
import AnalyticsService from '../services/analyticsService';
import CacheService from '../services/cacheService';
import { moderateRateLimit } from '../middleware/rateLimiter';

const router = express.Router();
const analyticsService = AnalyticsService.getInstance();
const cacheService = CacheService.getInstance();

// Apply rate limiting and authentication to all routes
router.use(moderateRateLimit);
router.use(protect);
router.use(authorize('admin', 'moderator'));

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview for admin dashboard
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics data
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics data
 *     responses:
 *       200:
 *         description: Analytics overview data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get('/overview', async (req, res): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if not specified
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate ? new Date(startDate as string) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Check cache first
    const cacheKey = `analytics:overview:${start.toISOString().split('T')[0]}:${end.toISOString().split('T')[0]}`;
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      res.json({
        success: true,
        data: cachedData,
        cached: true,
      });
      return;
    }
    
    const analytics = await analyticsService.getAnalytics(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
    
    // Cache for 1 hour
    await cacheService.set(cacheKey, analytics, 3600);
    
    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics overview',
    });
  }
});

/**
 * @swagger
 * /api/analytics/realtime:
 *   get:
 *     summary: Get real-time analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time analytics data
 */
router.get('/realtime', async (req, res) => {
  try {
    const realTimeData = await analyticsService.getRealTimeAnalytics();
    
    res.json({
      success: true,
      data: realTimeData,
    });
  } catch (error) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time analytics',
    });
  }
});

/**
 * @swagger
 * /api/analytics/books:
 *   get:
 *     summary: Get book-specific analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book analytics data
 */
router.get('/books', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // This would fetch book-specific analytics
    // For now, return mock data structure
    const bookAnalytics = {
      topBooks: [],
      salesTrends: {},
      categoryPerformance: {},
      conversionRates: {},
    };
    
    res.json({
      success: true,
      data: bookAnalytics,
    });
  } catch (error) {
    console.error('Book analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book analytics',
    });
  }
});

/**
 * @swagger
 * /api/analytics/events:
 *   get:
 *     summary: Get event-specific analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event analytics data
 */
router.get('/events', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // This would fetch event-specific analytics
    const eventAnalytics = {
      upcomingEvents: [],
      registrationTrends: {},
      attendanceRates: {},
      popularEventTypes: {},
    };
    
    res.json({
      success: true,
      data: eventAnalytics,
    });
  } catch (error) {
    console.error('Event analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event analytics',
    });
  }
});

/**
 * @swagger
 * /api/analytics/users:
 *   get:
 *     summary: Get user analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics data
 */
router.get('/users', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // This would fetch user-specific analytics
    const userAnalytics = {
      totalUsers: 0,
      newUsers: {},
      activeUsers: {},
      userRetention: {},
      demographics: {},
    };
    
    res.json({
      success: true,
      data: userAnalytics,
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics',
    });
  }
});

/**
 * @swagger
 * /api/analytics/performance:
 *   get:
 *     summary: Get performance metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics
 */
router.get('/performance', async (req, res) => {
  try {
    // This would fetch performance metrics
    const performanceMetrics = {
      responseTime: {
        average: 250,
        p95: 500,
        p99: 1000,
      },
      cacheHitRate: 0.85,
      errorRate: 0.02,
      uptime: 0.999,
      throughput: {
        requestsPerSecond: 150,
        requestsPerHour: 540000,
      },
    };
    
    res.json({
      success: true,
      data: performanceMetrics,
    });
  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics',
    });
  }
});

export default router;