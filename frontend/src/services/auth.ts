import { apiService } from './api';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      const { user, token } = response.data.data;
      apiService.setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data.data;
    }
    throw new Error(response.data.error || 'Login failed');
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    if (response.data.success && response.data.data) {
      const { user, token } = response.data.data;
      apiService.setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data.data;
    }
    throw new Error(response.data.error || 'Registration failed');
  },

  async logout(): Promise<void> {
    apiService.removeAuthToken();
  },

  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/profile');
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get profile');
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/auth/profile', userData);
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update profile');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiService.put<ApiResponse<any>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change password');
    }
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  },
};