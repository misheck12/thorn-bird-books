export interface IUser {
  _id?: string;
  email: string;
  password?: string;
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
  socialAccounts?: {
    google?: {
      id: string;
      email: string;
    };
    facebook?: {
      id: string;
      email: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBook {
  _id?: string;
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
  publishedDate: Date;
  language: string;
  pages: number;
  format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartItem {
  bookId: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  type: 'book_signing' | 'reading' | 'workshop' | 'discussion' | 'launch';
  date: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventRegistration {
  _id?: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'attended' | 'cancelled';
  registrationDate: Date;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: string;
  bookId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlist {
  _id?: string;
  userId: string;
  books: string[];
  createdAt?: Date;
  updatedAt?: Date;
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
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface BookFilters extends PaginationQuery {
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  format?: string;
  search?: string;
  inStock?: boolean;
}

export interface EventFilters extends PaginationQuery {
  type?: string;
  city?: string;
  date?: string;
  isFree?: boolean;
}