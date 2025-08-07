# Thorn Bird Books - Complete Publishing Platform

A comprehensive full-stack application for **Thorn Bird Books**, a publishing company that specializes in book publishing, editing services, book sales, and literacy events.

## 🚀 Project Overview

This project provides a complete foundation for a publishing company's digital presence, including:

- **User-facing website** for customers and readers
- **Admin dashboard** for managing all business operations
- **REST API backend** for data management
- **Database schema** for all business entities
- **Sample content** and documentation

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Stripe** payment integration (ready)
- **Multer** for file uploads
- **Nodemailer** for email notifications

### Frontend (User Website)
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for form handling

### Admin Dashboard
- **React 18** with admin-specific components
- **Tailwind CSS** with admin styling
- **Recharts** for analytics and charts
- **React Query** for data management

### Database
- **PostgreSQL** with comprehensive schema
- **Sample data** included
- **Migration scripts** ready

## 📁 Project Structure

```
thorn-bird-books/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Data models
│   │   ├── middleware/     # Auth & validation
│   │   └── services/       # External services
│   ├── config/             # Database & environment config
│   └── package.json
├── frontend/               # User-facing React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   └── styles/         # Tailwind CSS
│   └── package.json
├── admin/                  # Admin dashboard React app
│   ├── src/
│   │   ├── components/     # Admin UI components
│   │   ├── pages/          # Admin pages
│   │   └── services/       # Admin API calls
│   └── package.json
├── database/               # Database files
│   ├── schema.sql          # Complete database schema
│   ├── migrations/         # Database migrations
│   └── seeds/              # Sample data
├── docs/                   # Documentation
│   ├── api/                # API documentation
│   ├── wireframes/         # UI wireframes
│   └── brand/              # Brand guidelines
└── assets/                 # Static assets
```

## 🎨 Brand Guidelines

### Colors
- **Primary**: Yellow (#eab308) - Warm, welcoming, creative
- **Secondary**: Light Green (#22c55e) - Growth, freshness, harmony  
- **Accent**: White (#ffffff) - Clean, professional

### Typography
- **Headers**: Georgia (serif) - Classic, literary feel
- **Body**: Inter (sans-serif) - Modern, readable

### Design Principles
- Clean and modern aesthetic
- Book-focused imagery
- Welcoming and approachable
- Professional yet creative

## 📊 Database Schema

The database includes comprehensive tables for:

### Core Entities
- **Users** - Customers, authors, admins with role-based access
- **Authors** - Author profiles with bio, social media, featured status
- **Books** - Complete book information with pricing, inventory, categories
- **Orders & Order Items** - E-commerce functionality with payment tracking

### Content Management
- **Articles** - Blog posts and literary content with SEO fields
- **Events** - Literary events with registration and capacity management
- **Testimonials** - Customer feedback with approval workflow

### Business Operations
- **Book Submissions** - Author manuscript submission and review process
- **Event Registrations** - Event attendance tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### 1. Database Setup
```bash
# Create database
createdb thorn_bird_books

# Run schema
psql thorn_bird_books < database/schema.sql

# Add sample data
psql thorn_bird_books < database/seeds/sample_data.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Admin Dashboard Setup
```bash
cd admin
npm install
npm start
```

## 🌐 Available Endpoints

### Frontend (Port 3000)
- Homepage with featured books and events
- About Us page
- Services overview
- Bookstore with filtering
- Events calendar
- Blog/Articles section
- Contact page

### Admin Dashboard (Port 3001)
- Dashboard with analytics
- Books management (CRUD, inventory)
- Orders tracking and management
- Events management and registrations
- Blog/article management
- User management
- Book submission reviews

### API (Port 5000)
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/books` - List books with filtering
- `GET /api/events` - List events
- `GET /api/authors` - List authors
- And many more...

## 📚 Sample Content Included

### Books
- Fiction and non-fiction titles
- Author information and biographies
- Pricing and inventory data
- Categories and genres

### Events
- Author readings
- Writing workshops
- Book launches
- Literacy programs

### Articles
- Writing tips and techniques
- Publishing industry insights
- Reading recommendations

### Users & Testimonials
- Sample customer accounts
- Author profiles
- Customer testimonials
- Admin users

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/thorn_bird_books
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
```

### Frontend Configuration
- Proxy configured to backend (port 5000)
- Tailwind CSS with custom theme
- React Router for navigation
- React Query for API calls

## 🚢 Deployment Ready

### Production Considerations
- Environment-specific configurations
- Database migrations
- SSL/HTTPS setup
- File upload handling
- Email service configuration
- Payment processing (Stripe)
- Monitoring and logging

### Recommended Hosting
- **Backend**: Heroku, Railway, or VPS
- **Frontend**: Vercel, Netlify, or CDN
- **Database**: PostgreSQL on AWS RDS, Heroku Postgres
- **Files**: AWS S3 or similar cloud storage

## 📈 Future Enhancements

### Phase 1 (Core Features)
- [ ] Complete API implementation
- [ ] User authentication UI
- [ ] Shopping cart functionality
- [ ] Event registration system
- [ ] Admin CRUD operations

### Phase 2 (Advanced Features)
- [ ] Payment processing integration
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] SEO optimization
- [ ] Mobile responsiveness

### Phase 3 (Scale & Optimize)
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Advanced admin analytics
- [ ] Multi-language support
- [ ] API rate limiting

## 🤝 Contributing

This is a foundational project ready for development team collaboration:

1. **Setup**: Follow the quick start guide
2. **Development**: Use feature branches
3. **Testing**: Add tests for new features
4. **Documentation**: Update docs for any changes

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For questions about this foundation project:
- Check the `/docs` folder for detailed documentation
- Review the sample data in `/database/seeds`
- Examine the API routes in `/backend/src/routes`

---

**Thorn Bird Books** - Where stories take flight and literary dreams come true. 📚✨
