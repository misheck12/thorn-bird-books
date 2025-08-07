export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  category: string;
  genre?: string;
  publisher: string;
  publishedDate: Date;
  pages: number;
  language: string;
  format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  coverImage: string;
  images?: string[];
  inStock: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  featured?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string;
  addresses: Address[];
  preferences: UserPreferences;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  favoriteGenres: string[];
  preferredLanguage: string;
  currency: string;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal';
  paymentIntentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  format: string;
  coverImage: string;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  addedAt: Date;
}

export interface Event {
  _id?: string;
  title: string;
  description: string;
  eventType: 'book_signing' | 'reading' | 'discussion' | 'workshop' | 'launch';
  author?: string;
  relatedBooks?: string[];
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  capacity: number;
  registeredCount: number;
  price: number;
  isVirtual: boolean;
  meetingLink?: string;
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Review {
  _id?: string;
  bookId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletter {
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: {
    newReleases: boolean;
    promotions: boolean;
    events: boolean;
    recommendations: boolean;
  };
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export interface EmailTemplate {
  _id?: string;
  name: string;
  subject: string;
  template: string;
  type: 'order_confirmation' | 'shipping_notification' | 'welcome' | 'password_reset' | 'newsletter' | 'event_reminder';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchQuery {
  _id?: string;
  query: string;
  userId?: string;
  sessionId?: string;
  resultsCount: number;
  clickedResults: string[];
  createdAt: Date;
}

export interface PaymentIntent {
  _id?: string;
  stripePaymentIntentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}