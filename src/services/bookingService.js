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
  console.log('Fetching garage services with payload:', payload);
  
  const { garageid, ccid } = payload;
  
  try {
    // Try real API first
    const response = await apiGet(`/garage/${garageid}/services?cc_id=${ccid}`);
    return response.data || response;
  } catch (error) {
    console.warn('API call failed for garage services:', error.message);
    // Return empty object if API fails
    return {
      services: [],
      addOns: []
    };
  }
};

// Fetch user addresses
export const fetchUserAddresses = async (subscriberId) => {
  console.log('Fetching user addresses for subscriber:', subscriberId);
  
  try {
    // Try real API first
    const response = await apiGet(`/user/addresses/${subscriberId}`);
    return response.data || response;
  } catch (error) {
    console.warn('API call failed for user addresses:', error.message);
    // Return empty array if API fails
    return [];
  }
};

// Create new address
export const createAddress = async (payload) => {
  console.log('Creating new address with payload:', payload);
  
  try {
    // Try real API first
    const response = await apiPost('/address/create', payload);
    return response;
  } catch (error) {
    console.warn('API call failed for address creation:', error.message);
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
  console.log('Fetching bike brands');
  
  try {
    // Try real API first
    const response = await apiGet('/bike-brands');
    return response.data || response;
  } catch (error) {
    console.warn('API call failed for bike brands:', error.message);
    // Return fallback data if API fails
    return [
      { id: 1, name: 'Honda' },
      { id: 2, name: 'Bajaj' },
      { id: 3, name: 'TVS' },
      { id: 4, name: 'Hero' },
      { id: 5, name: 'Yamaha' },
      { id: 6, name: 'Royal Enfield' },
      { id: 7, name: 'KTM' },
      { id: 8, name: 'Suzuki' }
    ];
  }
};

// Fetch bike models by brand
export const fetchBikeModels = async (brandId) => {
  console.log('🔍 Fetching bike models for brand ID:', brandId);
  
  try {
    // Try real API first
    console.log('🔍 Attempting API call to /bike-models/' + brandId);
    const response = await apiGet(`/bike-models/${brandId}`);
    console.log('🔍 API response received:', response);
    return response.data || response;
  } catch (error) {
    console.warn('🔍 API call failed for bike models:', error.message);
    console.log('🔍 Using fallback data for brand ID:', brandId);
    // Return fallback data if API fails
    const fallbackModels = {
      1: [ // Honda
        { id: 1, name: 'Activa 6G', cc: '110cc', cc_id: 1 },
        { id: 2, name: 'Shine', cc: '125cc', cc_id: 2 },
        { id: 3, name: 'Unicorn', cc: '160cc', cc_id: 3 },
        { id: 4, name: 'CB Hornet', cc: '160cc', cc_id: 3 }
      ],
      2: [ // Bajaj
        { id: 5, name: 'Pulsar 150', cc: '150cc', cc_id: 4 },
        { id: 6, name: 'Pulsar 220', cc: '220cc', cc_id: 5 },
        { id: 7, name: 'Discover', cc: '125cc', cc_id: 2 },
        { id: 8, name: 'CT 100', cc: '100cc', cc_id: 6 }
      ],
      3: [ // TVS
        { id: 9, name: 'Jupiter', cc: '110cc', cc_id: 1 },
        { id: 10, name: 'Apache RTR', cc: '160cc', cc_id: 3 },
        { id: 11, name: 'Star City', cc: '110cc', cc_id: 1 },
        { id: 12, name: 'Sport', cc: '110cc', cc_id: 1 }
      ],
      4: [ // Hero
        { id: 13, name: 'Splendor', cc: '100cc', cc_id: 6 },
        { id: 14, name: 'Passion Pro', cc: '110cc', cc_id: 1 },
        { id: 15, name: 'Xtreme', cc: '160cc', cc_id: 3 },
        { id: 16, name: 'Glamour', cc: '125cc', cc_id: 2 }
      ],
      5: [ // Yamaha
        { id: 17, name: 'FZ', cc: '150cc', cc_id: 4 },
        { id: 18, name: 'R15', cc: '155cc', cc_id: 7 },
        { id: 19, name: 'Fascino', cc: '125cc', cc_id: 2 },
        { id: 20, name: 'Ray ZR', cc: '125cc', cc_id: 2 }
      ],
      6: [ // Royal Enfield
        { id: 21, name: 'Classic 350', cc: '350cc', cc_id: 8 },
        { id: 22, name: 'Bullet 350', cc: '350cc', cc_id: 8 },
        { id: 23, name: 'Thunderbird', cc: '350cc', cc_id: 8 },
        { id: 24, name: 'Continental GT', cc: '650cc', cc_id: 9 }
      ],
      7: [ // KTM
        { id: 25, name: 'Duke 200', cc: '200cc', cc_id: 10 },
        { id: 26, name: 'Duke 390', cc: '390cc', cc_id: 11 },
        { id: 27, name: 'RC 200', cc: '200cc', cc_id: 10 },
        { id: 28, name: 'RC 390', cc: '390cc', cc_id: 11 }
      ],
      8: [ // Suzuki
        { id: 29, name: 'Access 125', cc: '125cc', cc_id: 2 },
        { id: 30, name: 'Gixxer', cc: '155cc', cc_id: 7 },
        { id: 31, name: 'Burgman', cc: '125cc', cc_id: 2 },
        { id: 32, name: 'Intruder', cc: '150cc', cc_id: 4 }
      ]
    };
    
    const result = fallbackModels[brandId] || [];
    console.log('🔍 Returning fallback models:', result);
    return result;
  }
};

// Fetch cities
export const fetchCities = async () => {
  console.log('Fetching cities');
  
  try {
    // Try real API first
    const response = await apiGet('/cities');
    return response.data || response;
  } catch (error) {
    console.warn('API call failed for cities:', error.message);
    // Return fallback data if API fails
    return [
      { id: 1, name: 'Mumbai', state: 'Maharashtra' },
      { id: 2, name: 'Delhi', state: 'NCR' },
      { id: 3, name: 'Bangalore', state: 'Karnataka' },
      { id: 4, name: 'Chennai', state: 'Tamil Nadu' },
      { id: 5, name: 'Pune', state: 'Maharashtra' },
      { id: 6, name: 'Hyderabad', state: 'Telangana' },
      { id: 7, name: 'Kolkata', state: 'West Bengal' },
      { id: 8, name: 'Ahmedabad', state: 'Gujarat' }
    ];
  }
};
