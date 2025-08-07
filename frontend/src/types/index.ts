export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  avatar?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  publisher: string;
  publishedDate: string;
  language: string;
  pages: number;
  format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  bookId: string | Book;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: 'book_signing' | 'reading' | 'workshop' | 'discussion' | 'launch';
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  capacity: number;
  registeredCount: number;
  price: number;
  isFree: boolean;
  isActive: boolean;
  featuredImage?: string;
  organizer: string;
  requirements?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  format?: string;
  search?: string;
  inStock?: boolean;
}