import { apiService } from './api';
import { ApiResponse, Event } from '../types';

export const eventService = {
  async getAllEvents(params?: {
    page?: number;
    limit?: number;
    type?: string;
    city?: string;
    date?: string;
    isFree?: boolean;
    search?: string;
  }): Promise<{ events: Event[]; pagination: any }> {
    const response = await apiService.get<ApiResponse<Event[]>>('/events', params);
    if (response.data.success && response.data.data) {
      return {
        events: response.data.data,
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.error || 'Failed to fetch events');
  },

  async getEventById(id: string): Promise<Event> {
    const response = await apiService.get<ApiResponse<Event>>(`/events/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch event');
  },

  async registerForEvent(eventId: string): Promise<any> {
    const response = await apiService.post<ApiResponse<any>>(`/events/${eventId}/register`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to register for event');
  },

  async cancelRegistration(eventId: string): Promise<void> {
    const response = await apiService.post<ApiResponse<void>>(`/events/${eventId}/cancel`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to cancel registration');
    }
  },

  async getUserRegistrations(status?: string): Promise<any[]> {
    const params = status ? { status } : undefined;
    const response = await apiService.get<ApiResponse<any[]>>('/events/my-registrations', params);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch registrations');
  },

  async getFeaturedEvents(limit: number = 6): Promise<Event[]> {
    const response = await apiService.get<ApiResponse<Event[]>>('/events', { 
      limit, 
      featured: true,
      isActive: true,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch featured events');
  },

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const response = await apiService.get<ApiResponse<Event[]>>('/events', {
      limit,
      sort: 'date',
      order: 'asc',
      isActive: true,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch upcoming events');
  },
};