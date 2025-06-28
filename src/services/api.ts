// API service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mystocknote-backend.onrender.com/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    // Check if response is HTML (likely an error page)
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Backend returned HTML instead of JSON. Server may be down or misconfigured.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Check if it's an email verification error
        if (data.requiresEmailVerification) {
          const error = new Error(data.message || 'Email verification required') as any;
          error.requiresEmailVerification = true;
          error.email = data.email;
          throw error;
        }
        
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        throw new Error('Session expired. Please login again.');
      }
      
      // Return the error with additional data for email verification
      const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`) as any;
      error.requiresEmailVerification = data.requiresEmailVerification;
      error.email = data.email;
      error.errors = data.errors; // Include validation errors
      error.statusCode = response.status;
      throw error;
    }
    
    return data;
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    try {
      const headers = this.getAuthHeaders();
      
      // Debug: Log the request details in development
      if (import.meta.env.DEV) {
        console.log('🌐 Making API request:', {
          url: `${API_BASE_URL}${url}`,
          method: options.method || 'GET',
          hasToken: !!localStorage.getItem('authToken'),
          headers: headers,
          body: options.body
        });
      }
      
      // Log API URL being used for debugging
      console.log('🔗 API Base URL:', API_BASE_URL);
      console.log('🌐 Full request URL:', `${API_BASE_URL}${url}`);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        },
        // Add timeout for better error handling
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`💥 API Request failed: ${url}`, error);
      console.error('🔗 API Base URL used:', API_BASE_URL);
      
      // Handle network errors more gracefully
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error(`Unable to connect to server at ${API_BASE_URL}. Please check your internet connection or try again later.`);
        }
      }
      
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    try {
      // For development/demo purposes, allow login with any credentials
      if (import.meta.env.DEV || !API_BASE_URL.includes('mystocknote-backend.onrender.com')) {
        console.log('Using development login mode');
        
        // Store user data in localStorage
        const userData = { 
          name: email.split('@')[0], 
          email: email 
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('authToken', 'dev-token-' + Date.now());
        
        return { 
          success: true, 
          data: { 
            user: userData,
            token: 'dev-token-' + Date.now()
          } 
        };
      }
      
      // Real API call for production
      const data = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data.success && data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        if (import.meta.env.DEV) {
          console.log('Token stored:', data.data.token.substring(0, 20) + '...');
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      // For development/demo, create a fallback login
      if (error instanceof Error && error.message.includes('Backend returned HTML')) {
        console.log('Backend unavailable, using fallback login');
        
        // Store user data in localStorage
        const userData = { 
          name: email.split('@')[0], 
          email: email 
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('authToken', 'fallback-token-' + Date.now());
        
        return { 
          success: true, 
          data: { 
            user: userData,
            token: 'fallback-token-' + Date.now()
          } 
        };
      }
      
      throw error;
    }
  }

  async signup(name: string, email: string, password: string) {
    try {
      // For development/demo purposes, allow signup with any credentials
      if (import.meta.env.DEV || !API_BASE_URL.includes('mystocknote-backend.onrender.com')) {
        console.log('Using development signup mode');
        
        // Store user in localStorage
        const users = JSON.parse(localStorage.getItem('stockNoteUsers') || '[]');
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        users.push({ name, email, password, verified: true });
        localStorage.setItem('stockNoteUsers', JSON.stringify(users));
        
        return { 
          success: true, 
          data: { 
            user: { name, email },
            requiresEmailVerification: false
          } 
        };
      }
      
      // Real API call for production
      return this.makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    } catch (error) {
      console.error('Signup error:', error);
      
      // Fallback to local storage if backend is down
      if (error instanceof Error && error.message.includes('Backend returned HTML')) {
        // Store user locally as fallback
        const user = { name, email };
        const users = JSON.parse(localStorage.getItem('stockNoteUsers') || '[]');
        
        // Check if user already exists
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        users.push({ ...user, password, verified: true });
        localStorage.setItem('stockNoteUsers', JSON.stringify(users));
        
        return { 
          success: true, 
          data: { 
            user,
            requiresEmailVerification: false
          } 
        };
      }
      
      throw error;
    }
  }

  async verifyEmail(email: string, token: string) {
    const data = await this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, token })
    });
    
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      if (import.meta.env.DEV) {
        console.log('Token stored after verification:', data.data.token.substring(0, 20) + '...');
      }
    }
    
    return data;
  }

  async resendVerificationEmail(email: string) {
    return this.makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async forgotPassword(email: string) {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, newPassword })
    });
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  }

  async checkAuthStatus() {
    return this.makeRequest('/auth/status');
  }

  // User Profile
  async getUserProfile() {
    try {
      return this.makeRequest('/auth/me');
    } catch (error) {
      console.error('Get user profile error:', error);
      
      // For development/demo, create a fallback profile
      if (error instanceof Error && error.message.includes('Backend returned HTML')) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          return { 
            success: true, 
            data: { user } 
          };
        }
      }
      
      throw error;
    }
  }

  async updateUserProfile(profileData: any) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Health Check - Updated with better error handling
  async healthCheck() {
    try {
      // Try the health endpoint first
      const healthUrl = `${API_BASE_URL.replace('/api', '')}/health`;
      console.log('Checking health at:', healthUrl);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      const contentType = response.headers.get('content-type');
      
      // Check if response is HTML (likely an error page)
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Backend returned HTML instead of JSON. Server may be down or misconfigured.');
      }
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Health check timed out. Backend server may be slow or down.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to backend server. Please check if the server is running.');
        }
      }
      
      throw error;
    }
  }

  // Additional API methods for other features...
  // These are placeholders that would be implemented in a real app
  
  async getJournalEntries() {
    // In a real app, this would call the backend API
    return { success: true, data: { entries: [] } };
  }
  
  async getFocusStocks() {
    // In a real app, this would call the backend API
    return { success: true, data: { stocks: [] } };
  }
  
  async getTeams() {
    // In a real app, this would call the backend API
    return { success: true, data: { teams: [] } };
  }
  
  async getTeam(id: string) {
    // In a real app, this would call the backend API
    return { success: true, data: { team: {} } };
  }
  
  async getTeamTrades(teamId: string) {
    // In a real app, this would call the backend API
    return { success: true, data: { trades: [] } };
  }
  
  async getBooks() {
    // In a real app, this would call the backend API
    return { success: true, data: { books: [] } };
  }
  
  async getDashboardData() {
    // In a real app, this would call the backend API
    return { success: true, data: {} };
  }
}

export const apiService = new ApiService();
export default apiService;