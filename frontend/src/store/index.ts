import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cart } from '../types';
import { authService } from '../services/auth';
import { cartService } from '../services/cart';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: authService.getCurrentUser(),
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authService.login({ email, password });
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authService.register(userData);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (userData) => {
        try {
          const updatedUser = await authService.updateProfile(userData);
          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      },

      refreshUser: async () => {
        if (!get().isAuthenticated) return;
        try {
          const user = await authService.getProfile();
          set({ user });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  totalAmount: number;
  fetchCart: () => Promise<void>;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  updateCartItem: (bookId: string, quantity: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isLoading: false,
  itemCount: 0,
  totalAmount: 0,

  fetchCart: async () => {
    if (!useAuthStore.getState().isAuthenticated) return;
    
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({ 
        cart, 
        itemCount: cart.totalItems, 
        totalAmount: cart.totalAmount, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch cart:', error);
    }
  },

  addToCart: async (bookId: string, quantity = 1) => {
    try {
      const cart = await cartService.addToCart(bookId, quantity);
      set({ 
        cart, 
        itemCount: cart.totalItems, 
        totalAmount: cart.totalAmount 
      });
    } catch (error) {
      throw error;
    }
  },

  updateCartItem: async (bookId: string, quantity: number) => {
    try {
      const cart = await cartService.updateCartItem(bookId, quantity);
      set({ 
        cart, 
        itemCount: cart.totalItems, 
        totalAmount: cart.totalAmount 
      });
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (bookId: string) => {
    try {
      const cart = await cartService.removeFromCart(bookId);
      set({ 
        cart, 
        itemCount: cart.totalItems, 
        totalAmount: cart.totalAmount 
      });
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const cart = await cartService.clearCart();
      set({ 
        cart, 
        itemCount: 0, 
        totalAmount: 0 
      });
    } catch (error) {
      throw error;
    }
  },
}));