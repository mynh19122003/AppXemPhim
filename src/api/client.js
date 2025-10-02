/**
 * HTTP Client - Xử lý tất cả HTTP requests
 * Dễ debug network issues
 */
import { API_CONFIG } from './config';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, params = {}) {
    const requestId = Math.random().toString(36).substr(2, 9);
    
    try {
      let url = `${this.baseURL}${endpoint}`;
      
      // Add query parameters
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key].toString());
          }
        });
        
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
      }

      console.log(`🌐 [${requestId}] Request:`, endpoint, params);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log(`📡 [${requestId}] Response:`, response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ [${requestId}] Success:`, data.status, data.data?.items?.length || data.items?.length);
      
      return this.normalizeResponse(data);
      
    } catch (error) {
      console.error(`💥 [${requestId}] Error:`, error.message);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      
      throw new Error(`API Error: ${error.message}`);
    }
  }

  normalizeResponse(data) {
    // Normalize different response structures
    if (data.data?.items) {
      return { status: data.status, data: data.data };
    } else if (data.items) {
      return { status: data.status, data: { items: data.items } };
    }
    return data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;