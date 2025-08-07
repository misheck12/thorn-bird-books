const express = require('express');
const router = express.Router();
const db = require('../../config/database');

// GET /api/events - Get all events with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'upcoming',
      event_type,
      is_featured,
      start_date,
      end_date
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Add filters
    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (event_type) {
      whereConditions.push(`event_type = $${paramIndex}`);
      queryParams.push(event_type);
      paramIndex++;
    }

    if (is_featured) {
      whereConditions.push(`is_featured = $${paramIndex}`);
      queryParams.push(is_featured === 'true');
      paramIndex++;
    }

    if (start_date) {
      whereConditions.push(`start_date >= $${paramIndex}`);
      queryParams.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      whereConditions.push(`end_date <= $${paramIndex}`);
      queryParams.push(end_date);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const query = `
      SELECT 
        *,
        (max_attendees - current_attendees) as available_spots
      FROM events
      ${whereClause}
      ORDER BY start_date ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM events
      ${whereClause}
    `;
    
    const countResult = await db.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);

    res.json({
      events: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get a specific event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        *,
        (max_attendees - current_attendees) as available_spots
      FROM events
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// GET /api/events/featured - Get featured events
router.get('/featured', async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const query = `
      SELECT 
        *,
        (max_attendees - current_attendees) as available_spots
      FROM events
      WHERE is_featured = true AND status = 'upcoming'
      ORDER BY start_date ASC
      LIMIT $1
    `;

    const result = await db.query(query, [parseInt(limit)]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    res.status(500).json({ error: 'Failed to fetch featured events' });
  }
});

module.exports = router;