// API services for booking flow with real API integration
import { apiGet, apiPost } from '../utils/api';

// Fetch user's vehicles
export const fetchUserVehicles = async (subscriberId) => {
  console.log('Fetching user vehicles for subscriber:', subscriberId);
  
  try {
    // Try real API first
    const response = await apiGet(`/user/vehicles/${subscriberId}`);
    return response.data || response;
  } catch (error) {
    console.warn('API call failed for user vehicles:', error.message);
    // Return empty array if API fails
    return [];
  }
};

// Fetch garage services
export const fetchGarageServices = async (payload) => {
  console.log('🔍 Fetching garage services with payload:', payload);
  
  try {
    // Try real API first - using correct endpoint from old website
    console.log('🔍 Attempting API call to /garage/services/ with POST');
    const response = await apiPost('/garage/services/', payload);
    console.log('🔍 API response for garage services:', response);
    
    // Handle response structure from API
    if (response.status === "success") {
      // The API returns data array directly, need to separate services and addons
      const allData = response.data || [];
      const services = allData.filter(item => item.service_type !== 'addon');
      const addOns = allData.filter(item => item.service_type === 'addon');
      
      return {
        services: services,
        addOns: addOns
      };
    } else {
      return {
        services: [],
        addOns: []
      };
    }
  } catch (error) {
    console.warn('🔍 API call failed for garage services:', error.message);
    // Return empty object if API fails
    return {
      services: [],
      addOns: []
    };
  }
};

// Fetch user addresses
export const fetchUserAddresses = async (subscriberId) => {
  console.log('🔍 Fetching user addresses for subscriber:', subscriberId);
  
  try {
    // Try real API first - using correct endpoint from old website
    const response = await apiGet(`/subscriber/addresses/?subscriber_id=${subscriberId}`);
    console.log('🔍 API response for user addresses:', response);
    
    if (response.status) {
      return response.data || [];
    } else {
      return [];
    }
  } catch (error) {
    console.warn('🔍 API call failed for user addresses:', error.message);
    // Return empty array if API fails
    return [];
  }
};

// Create new address
export const createAddress = async (payload) => {
  console.log('🔍 Creating new address with payload:', payload);
  
  try {
    // Try real API first - using correct endpoint from old website
    const response = await apiPost('/subscriber/address/', payload);
    console.log('🔍 API response for address creation:', response);
    return response;
  } catch (error) {
    console.warn('🔍 API call failed for address creation:', error.message);
    // Return error response if API fails
    return {
      success: false,
      message: "Failed to create address"
    };
  }
};

// Create booking
export const createBooking = async (payload) => {
  console.log('Creating booking with payload:', payload);
  
  try {
    // Try real API first
    const response = await apiPost('/booking/create', payload);
    return response;
  } catch (error) {
    console.warn('API call failed for booking creation:', error.message);
    // Return error response if API fails
    return {
      success: false,
      message: "Failed to create booking"
    };
  }
};

// Fetch bike brands
export const fetchBikeBrands = async () => {
  console.log('🔍 Fetching bike brands from /brands/ endpoint');
  
  try {
    // Try real API first - using correct endpoint from old website
    const response = await apiGet('/brands/');
    console.log('🔍 API response for brands:', response);
    return response.data || response;
  } catch (error) {
    console.warn('🔍 API call failed for bike brands:', error.message);
    // Return empty array if API fails
    return [];
  }
};

// Fetch bike models by brand
export const fetchBikeModels = async (brandId) => {
  console.log('🔍 Fetching bike models for brand ID:', brandId);
  
  try {
    // Try real API first - using correct endpoint from old website
    console.log('🔍 Attempting API call to /models/?id=' + brandId);
    const response = await apiGet(`/models/?id=${brandId}`);
    console.log('🔍 API response received:', response);
    return response.data || response;
  } catch (error) {
    console.warn('🔍 API call failed for bike models:', error.message);
    // Return empty array if API fails
    return [];
  }
};

// Fetch cities from landing page API (like old website)
export const fetchCities = async (cityName = 'Pune') => {
  console.log('🔍 Fetching cities from landing page API for city:', cityName);
  
  try {
    // Try real API first - using correct endpoint from old website
    const response = await apiGet(`/active-cities/?city=${cityName.toLowerCase()}`);
    console.log('🔍 API response for cities:', response);
    
    if (response.status === "success" && response.data) {
      return response.data.cities || [];
    } else {
      return [];
    }
  } catch (error) {
    console.warn('🔍 API call failed for cities:', error.message);
    // Return empty array if API fails
    return [];
  }
};
