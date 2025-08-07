const express = require('express');
const router = express.Router();
const db = require('../../config/database');

// GET /api/authors - Get all authors
router.get('/', async (req, res) => {
  try {
    const { featured_only } = req.query;
    
    let query = 'SELECT * FROM authors';
    const queryParams = [];
    
    if (featured_only === 'true') {
      query += ' WHERE is_featured = true';
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await db.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});

// GET /api/authors/:id - Get specific author
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const authorQuery = 'SELECT * FROM authors WHERE id = $1';
    const booksQuery = `
      SELECT * FROM books 
      WHERE author_id = $1 AND is_published = true 
      ORDER BY publication_date DESC
    `;
    
    const [authorResult, booksResult] = await Promise.all([
      db.query(authorQuery, [id]),
      db.query(booksQuery, [id])
    ]);
    
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.json({
      ...authorResult.rows[0],
      books: booksResult.rows
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ error: 'Failed to fetch author' });
  }
});

module.exports = router;