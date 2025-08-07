import { apiService } from './api';
import { ApiResponse, Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await apiService.get<ApiResponse<Cart>>('/cart');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch cart');
  },

  async addToCart(bookId: string, quantity: number = 1): Promise<Cart> {
    const response = await apiService.post<ApiResponse<Cart>>('/cart/add', { bookId, quantity });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to add item to cart');
  },

  async updateCartItem(bookId: string, quantity: number): Promise<Cart> {
    const response = await apiService.put<ApiResponse<Cart>>(`/cart/update/${bookId}`, { quantity });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update cart item');
  },

  async removeFromCart(bookId: string): Promise<Cart> {
    const response = await apiService.delete<ApiResponse<Cart>>(`/cart/remove/${bookId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to remove item from cart');
  },

  async clearCart(): Promise<Cart> {
    const response = await apiService.delete<ApiResponse<Cart>>('/cart/clear');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to clear cart');
  },

  async getCartSummary(): Promise<{ totalItems: number; totalAmount: number; itemCount: number }> {
    const response = await apiService.get<ApiResponse<{ totalItems: number; totalAmount: number; itemCount: number }>>('/cart/summary');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch cart summary');
  },
};