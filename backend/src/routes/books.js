const express = require('express');
const router = express.Router();
const db = require('../../config/database');

// GET /api/books - Get all published books with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      genre, 
      author_id, 
      is_featured, 
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['b.is_published = true'];
    let queryParams = [];
    let paramIndex = 1;

    // Add filters
    if (category) {
      whereConditions.push(`b.category ILIKE $${paramIndex}`);
      queryParams.push(`%${category}%`);
      paramIndex++;
    }

    if (genre) {
      whereConditions.push(`b.genre ILIKE $${paramIndex}`);
      queryParams.push(`%${genre}%`);
      paramIndex++;
    }

    if (author_id) {
      whereConditions.push(`b.author_id = $${paramIndex}`);
      queryParams.push(author_id);
      paramIndex++;
    }

    if (is_featured) {
      whereConditions.push(`b.is_featured = $${paramIndex}`);
      queryParams.push(is_featured === 'true');
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(b.title ILIKE $${paramIndex} OR b.description ILIKE $${paramIndex} OR a.name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');
    
    const query = `
      SELECT 
        b.*,
        a.name as author_name,
        a.image_url as author_image_url
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE ${whereClause}
      ORDER BY b.${sort_by} ${sort_order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM books b 
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE ${whereClause}
    `;
    
    const countResult = await db.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);

    res.json({
      books: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:id - Get a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        b.*,
        a.name as author_name,
        a.bio as author_bio,
        a.image_url as author_image_url,
        a.website as author_website,
        a.social_media as author_social_media
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE b.id = $1 AND b.is_published = true
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// GET /api/books/featured - Get featured books
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const query = `
      SELECT 
        b.*,
        a.name as author_name,
        a.image_url as author_image_url
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE b.is_published = true AND b.is_featured = true
      ORDER BY b.created_at DESC
      LIMIT $1
    `;

    const result = await db.query(query, [parseInt(limit)]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ error: 'Failed to fetch featured books' });
  }
});

module.exports = router;