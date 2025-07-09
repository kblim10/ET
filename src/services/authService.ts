import { User, LoginRequest, RegisterRequest, ApiResponse } from '../types';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

class AuthService {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        credentials
      );

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        await this.setToken(token);
        return { user, token };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/register',
        userData
      );

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        await this.setToken(token);
        return { user, token };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout request fails, we should clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      await this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get user data');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');

      if (response.data.success && response.data.data) {
        const { token } = response.data.data;
        await this.setToken(token);
        return token;
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await api.post<ApiResponse>('/auth/forgot-password', { email });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Request failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post<ApiResponse>('/auth/reset-password', {
        token,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password reset failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post<ApiResponse>('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
  }

  // Token management
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Initialize auth (call this on app startup)
  async initializeAuth(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

export default new AuthService();
