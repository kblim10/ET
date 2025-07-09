import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'  // Development
  : 'https://your-production-api.com/api';  // Production

const TIMEOUT = 10000; // 10 seconds
const TOKEN_KEY = 'auth_token';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config): Promise<any> => {
    try {
      // Add auth token if available
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (__DEV__) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
        });
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log response in development
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle token expiration
    if (error.response?.status === 401) {
      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (refreshResponse.data.success) {
            const newToken = refreshResponse.data.data.token;
            await AsyncStorage.setItem(TOKEN_KEY, newToken);
            
            // Retry original request with new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        await AsyncStorage.multiRemove([TOKEN_KEY, 'refresh_token']);
        // You might want to trigger a logout action here
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiMethods = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config);
  },

  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config);
  },

  // Upload file
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Utility functions
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const setBaseURL = (url: string): void => {
  api.defaults.baseURL = url;
};

export const setTimeout = (timeout: number): void => {
  api.defaults.timeout = timeout;
};

// Health check
export const healthCheck = (): Promise<AxiosResponse> => {
  return api.get('/health');
};

export default api;
