import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

const sampleBooks = [
  {
    title: "The Great Adventure",
    author: "Jane Smith",
    isbn: "978-0123456789",
    description: "An epic tale of courage, friendship, and discovery that spans continents and challenges everything you think you know about heroism.",
    price: 24.99,
    category: "Fiction",
    genre: "Adventure",
    publisher: "Adventure Press",
    publishedDate: new Date("2023-06-15"),
    pages: 342,
    language: "English",
    format: "hardcover",
    coverImage: "/images/books/great-adventure.jpg",
    inStock: 25,
    rating: 4.5,
    reviewCount: 87,
    tags: ["adventure", "friendship", "epic"],
    featured: true,
    isActive: true
  },
  {
    title: "Mystery of the Blue Rose",
    author: "Robert Johnson",
    isbn: "978-0987654321",
    description: "A gripping mystery that will keep you on the edge of your seat until the very last page. Detective Sarah Mills faces her most challenging case yet.",
    price: 19.99,
    category: "Mystery",
    genre: "Detective",
    publisher: "Mystery House",
    publishedDate: new Date("2023-08-20"),
    pages: 298,
    language: "English",
    format: "paperback",
    coverImage: "/images/books/blue-rose-mystery.jpg",
    inStock: 40,
    rating: 4.2,
    reviewCount: 156,
    tags: ["mystery", "detective", "suspense"],
    featured: true,
    isActive: true
  },
  {
    title: "Love in the Digital Age",
    author: "Emma Davis",
    isbn: "978-0456789123",
    description: "A contemporary romance exploring how technology shapes modern relationships. Can true love survive in a world of dating apps and social media?",
    price: 16.99,
    category: "Romance",
    genre: "Contemporary",
    publisher: "Heart Publishers",
    publishedDate: new Date("2023-09-10"),
    pages: 276,
    language: "English",
    format: "paperback",
    coverImage: "/images/books/digital-love.jpg",
    inStock: 30,
    rating: 4.0,
    reviewCount: 92,
    tags: ["romance", "contemporary", "technology"],
    featured: false,
    isActive: true
  },
  {
    title: "The Science of Tomorrow",
    author: "Dr. Michael Chen",
    isbn: "978-0789123456",
    description: "An accessible exploration of cutting-edge scientific discoveries and their potential impact on our future. Perfect for curious minds and science enthusiasts.",
    price: 29.99,
    category: "Non-Fiction",
    genre: "Science",
    publisher: "Future Science Press",
    publishedDate: new Date("2023-07-05"),
    pages: 384,
    language: "English",
    format: "hardcover",
    coverImage: "/images/books/science-tomorrow.jpg",
    inStock: 20,
    rating: 4.7,
    reviewCount: 203,
    tags: ["science", "future", "technology"],
    featured: true,
    isActive: true
  },
  {
    title: "Galactic Empire: Rise of the Phoenix",
    author: "Alex Rodriguez",
    isbn: "978-0321654987",
    description: "The thrilling conclusion to the Galactic Empire trilogy. As the Phoenix rises from the ashes of war, new alliances form and ancient enemies return.",
    price: 22.99,
    category: "Science Fiction",
    genre: "Space Opera",
    publisher: "Starlight Books",
    publishedDate: new Date("2023-05-30"),
    pages: 456,
    language: "English",
    format: "hardcover",
    coverImage: "/images/books/galactic-empire.jpg",
    inStock: 35,
    rating: 4.8,
    reviewCount: 324,
    tags: ["sci-fi", "space", "trilogy"],
    featured: true,
    isActive: true
  },
  {
    title: "The Mindful Leader",
    author: "Sarah Williams",
    isbn: "978-0147258369",
    description: "Transform your leadership style with mindfulness practices. Learn how to lead with clarity, compassion, and authentic presence in today's fast-paced world.",
    price: 21.99,
    category: "Self-Help",
    genre: "Leadership",
    publisher: "Wisdom Press",
    publishedDate: new Date("2023-04-12"),
    pages: 234,
    language: "English",
    format: "paperback",
    coverImage: "/images/books/mindful-leader.jpg",
    inStock: 45,
    rating: 4.3,
    reviewCount: 178,
    tags: ["leadership", "mindfulness", "business"],
    featured: false,
    isActive: true
  },
  {
    title: "Children's Garden Adventures",
    author: "Lisa Thompson",
    isbn: "978-0852741963",
    description: "Join Bella and her friends as they discover the magical world hidden in their grandmother's garden. A delightful story about nature, friendship, and wonder.",
    price: 12.99,
    category: "Children",
    genre: "Picture Book",
    publisher: "Little Readers",
    publishedDate: new Date("2023-03-18"),
    pages: 48,
    language: "English",
    format: "hardcover",
    coverImage: "/images/books/garden-adventures.jpg",
    inStock: 60,
    rating: 4.6,
    reviewCount: 89,
    tags: ["children", "nature", "friendship"],
    featured: false,
    isActive: true
  },
  {
    title: "Digital Marketing Mastery",
    author: "Tom Anderson",
    isbn: "978-0963852741",
    description: "Master the art and science of digital marketing with proven strategies, case studies, and actionable insights from industry experts.",
    price: 34.99,
    category: "Non-Fiction",
    genre: "Business",
    publisher: "Business Excellence",
    publishedDate: new Date("2023-08-01"),
    pages: 412,
    language: "English",
    format: "paperback",
    coverImage: "/images/books/digital-marketing.jpg",
    inStock: 25,
    rating: 4.4,
    reviewCount: 267,
    tags: ["marketing", "business", "digital"],
    featured: false,
    isActive: true
  },
  {
    title: "The Enchanted Forest",
    author: "Morgan Blake",
    isbn: "978-0741852963",
    description: "Enter a world where magic still exists and ancient prophecies come true. Young Aria must discover her destiny to save both the magical and human worlds.",
    price: 18.99,
    category: "Fantasy",
    genre: "Young Adult",
    publisher: "Mystical Tales",
    publishedDate: new Date("2023-06-22"),
    pages: 356,
    language: "English",
    format: "paperback",
    coverImage: "/images/books/enchanted-forest.jpg",
    inStock: 38,
    rating: 4.1,
    reviewCount: 142,
    tags: ["fantasy", "magic", "young-adult"],
    featured: false,
    isActive: true
  },
  {
    title: "World War II: Untold Stories",
    author: "Professor David Miller",
    isbn: "978-0369741852",
    description: "Discover remarkable stories of courage, sacrifice, and resilience from World War II that have never been told before. Based on newly uncovered archives.",
    price: 27.99,
    category: "History",
    genre: "Military History",
    publisher: "Historical Archives",
    publishedDate: new Date("2023-05-08"),
    pages: 398,
    language: "English",
    format: "hardcover",
    coverImage: "/images/books/wwii-stories.jpg",
    inStock: 22,
    rating: 4.9,
    reviewCount: 156,
    tags: ["history", "wwii", "biography"],
    featured: false,
    isActive: true
  }
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing books
    await Book.deleteMany({});

    // Insert sample books
    const books = await Book.insertMany(sampleBooks);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${books.length} books`,
      data: books
    });

  } catch (error: unknown) {
    console.error('Error seeding books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed books' },
      { status: 500 }
    );
  }
}