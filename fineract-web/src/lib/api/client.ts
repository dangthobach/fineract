import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@/lib/config';

// Create the API client instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Fineract-Platform-TenantId': config.api.tenantId,
    'Accept': 'application/json',
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('fineract_token');
    if (token) {
      config.headers.Authorization = `Basic ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('fineract_token');
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication failed. Please login again.'));
      }

      // Handle authorization errors
      if (status === 403) {
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      }

      // Handle not found errors
      if (status === 404) {
        return Promise.reject(new Error('The requested resource was not found.'));
      }

      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error occurred. Please try again later.'));
      }

      // Handle validation errors
      if (status === 400 && data?.errors) {
        const errorMessage = data.errors.map((err: any) => err.defaultUserMessage || err.userMessageGlobalisationCode).join(', ');
        return Promise.reject(new Error(errorMessage));
      }

      // Generic error handling
      const errorMessage = data?.defaultUserMessage || data?.message || `HTTP ${status} error occurred`;
      return Promise.reject(new Error(errorMessage));
    }

    // Handle network errors
    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// API client wrapper class
export class FineractAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient;
  }

  // Generic GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // Generic POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // Generic PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // Generic PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  // Generic DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Authentication method
  async authenticate(username: string, password: string): Promise<{ token: string; user: any }> {
    // Encode credentials in base64
    const credentials = btoa(`${username}:${password}`);
    
    // Make authentication request
    const response = await this.client.post('/authentication', {}, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    const token = credentials; // In real implementation, this would be a JWT token
    const user = response.data;

    // Store token in localStorage
    localStorage.setItem('fineract_token', token);

    return { token, user };
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('fineract_token');
  }

  // Get current user
  async getCurrentUser(): Promise<any> {
    return this.get('/userdetails');
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('fineract_token');
  }
}

// Export singleton instance
export const fineractAPI = new FineractAPIClient();

// Export axios instance for direct use if needed
export { apiClient };

// Helper function to build query parameters
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper function for handling file uploads
export const uploadFile = async (url: string, file: File, additionalData?: Record<string, any>): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
