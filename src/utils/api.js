// API utility functions for making HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://workshop.bikedoot.com/api';

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Add authentication token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to get the error response body
      let errorData;
      try {
        errorData = await response.json();
        console.error('🔍 API Error Response:', errorData);
        if (errorData.errors) {
          console.error('🔍 Detailed Validation Errors:', errorData.errors);
          Object.keys(errorData.errors).forEach(field => {
            console.error(`🔍 Field "${field}" error:`, errorData.errors[field]);
          });
        }
      } catch (jsonError) {
        console.error('🔍 Could not parse error response as JSON');
      }
      
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    
    // Check if response is HTML (404 page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Server returned HTML instead of JSON - endpoint may not exist');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// GET request
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

// POST request
export const apiPost = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const apiPut = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const apiDelete = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};
