# Thorn Bird Books API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "data": {...},
  "message": "Success message",
  "pagination": {...} // For paginated endpoints
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

#### Get User Profile
```http
GET /auth/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Books

#### Get All Books
```http
GET /books
```

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 12)
- `category` (string): Filter by category
- `genre` (string): Filter by genre
- `author_id` (int): Filter by author ID
- `is_featured` (boolean): Filter featured books
- `search` (string): Search in title, description, author name
- `sort_by` (string): Sort field (default: created_at)
- `sort_order` (string): Sort direction (ASC/DESC, default: DESC)

**Response:**
```json
{
  "books": [
    {
      "id": 1,
      "title": "The Last Summer",
      "subtitle": "A Novel",
      "isbn": "978-0123456789",
      "author_id": 1,
      "author_name": "Sarah Johnson",
      "description": "A poignant tale of friendship...",
      "price": 24.99,
      "discount_price": 19.99,
      "cover_image_url": "/images/books/the-last-summer.jpg",
      "category": "Fiction",
      "genre": "Contemporary Fiction",
      "pages": 342,
      "publication_date": "2023-06-15",
      "stock_quantity": 150,
      "is_featured": true,
      "is_published": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Book by ID
```http
GET /books/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "The Last Summer",
  "author_name": "Sarah Johnson",
  "author_bio": "Award-winning novelist...",
  "author_image_url": "/images/authors/sarah-johnson.jpg",
  "author_website": "https://sarahjohnsonbooks.com",
  "author_social_media": {
    "twitter": "@sarahjwriter",
    "instagram": "@sarahjohnsonbooks"
  }
}
```

#### Get Featured Books
```http
GET /books/featured
```

**Query Parameters:**
- `limit` (int): Number of books to return (default: 6)

### Authors

#### Get All Authors
```http
GET /authors
```

**Query Parameters:**
- `featured_only` (boolean): Return only featured authors

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sarah Johnson",
    "bio": "Award-winning novelist...",
    "website": "https://sarahjohnsonbooks.com",
    "social_media": {
      "twitter": "@sarahjwriter",
      "instagram": "@sarahjohnsonbooks"
    },
    "image_url": "/images/authors/sarah-johnson.jpg",
    "is_featured": true
  }
]
```

#### Get Author by ID
```http
GET /authors/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Sarah Johnson",
  "bio": "Award-winning novelist...",
  "books": [
    {
      "id": 1,
      "title": "The Last Summer",
      "price": 24.99,
      "is_published": true
    }
  ]
}
```

### Events

#### Get All Events
```http
GET /events
```

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 10)
- `status` (string): Filter by status (upcoming, ongoing, completed, cancelled)
- `event_type` (string): Filter by type (reading, workshop, book_launch, literacy_program, author_meet)
- `is_featured` (boolean): Filter featured events
- `start_date` (string): Filter events starting after this date
- `end_date` (string): Filter events ending before this date

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "title": "Author Reading: Sarah Johnson",
      "description": "Join bestselling author...",
      "event_type": "reading",
      "start_date": "2024-03-15T19:00:00Z",
      "end_date": "2024-03-15T21:00:00Z",
      "location": "Thorn Bird Books Main Store",
      "max_attendees": 50,
      "current_attendees": 23,
      "available_spots": 27,
      "price": 0.00,
      "is_free": true,
      "is_featured": true,
      "status": "upcoming"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

#### Get Event by ID
```http
GET /events/:id
```

#### Get Featured Events
```http
GET /events/featured
```

**Query Parameters:**
- `limit` (int): Number of events to return (default: 3)

## Error Codes

- `400` - Bad Request: Invalid request parameters
- `401` - Unauthorized: Missing or invalid authentication
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

## Rate Limiting

- **Limit**: 100 requests per 15-minute window per IP
- **Headers**: Rate limit info included in response headers
- **Response**: 429 status when limit exceeded

## Development Notes

### Pagination
Most list endpoints support pagination with `page` and `limit` parameters. The response includes pagination metadata.

### Filtering
Many endpoints support filtering. Check individual endpoint documentation for available filters.

### Authentication
- JWT tokens expire after 7 days by default
- Refresh mechanism to be implemented
- Role-based access control (admin, customer, author)

### File Uploads
File upload endpoints accept multipart/form-data with specific field names. Maximum file size is 10MB.

### Future Endpoints
Additional endpoints will be added for:
- Order management
- Article/blog management
- Testimonials
- Book submissions
- Admin operations

## Contact

For API questions or issues, please refer to the development team or check the GitHub repository.