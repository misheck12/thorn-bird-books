import { apiService } from './api';
import { ApiResponse, Book, BookFilters } from '../types';

export const bookService = {
  async getAllBooks(filters?: BookFilters): Promise<{ books: Book[]; pagination: any }> {
    const response = await apiService.get<ApiResponse<Book[]>>('/books', filters);
    if (response.data.success && response.data.data) {
      return {
        books: response.data.data,
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.error || 'Failed to fetch books');
  },

  async getBookById(id: string): Promise<Book> {
    const response = await apiService.get<ApiResponse<Book>>(`/books/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch book');
  },

  async getFeaturedBooks(limit: number = 6): Promise<Book[]> {
    const response = await apiService.get<ApiResponse<Book[]>>('/books/featured', { limit });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch featured books');
  },

  async getNewArrivals(limit: number = 6): Promise<Book[]> {
    const response = await apiService.get<ApiResponse<Book[]>>('/books/new-arrivals', { limit });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch new arrivals');
  },

  async getBestSellers(limit: number = 6): Promise<Book[]> {
    const response = await apiService.get<ApiResponse<Book[]>>('/books/best-sellers', { limit });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch best sellers');
  },

  async searchBooks(query: string, page: number = 1, limit: number = 10): Promise<{ books: Book[]; pagination: any }> {
    const response = await apiService.get<ApiResponse<Book[]>>('/books/search', { q: query, page, limit });
    if (response.data.success && response.data.data) {
      return {
        books: response.data.data,
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.error || 'Failed to search books');
  },

  async getBooksByCategory(category: string, page: number = 1, limit: number = 10): Promise<{ books: Book[]; pagination: any }> {
    const response = await apiService.get<ApiResponse<Book[]>>(`/books/category/${category}`, { page, limit });
    if (response.data.success && response.data.data) {
      return {
        books: response.data.data,
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.error || 'Failed to fetch books by category');
  },

  async getCategories(): Promise<string[]> {
    const response = await apiService.get<ApiResponse<string[]>>('/books/categories');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch categories');
  },

  async getAuthors(): Promise<string[]> {
    const response = await apiService.get<ApiResponse<string[]>>('/books/authors');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch authors');
  },
};