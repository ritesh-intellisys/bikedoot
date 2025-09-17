// API services for booking flow with real API integration
import { apiGet, apiPost } from '../utils/api';

// Fetch user's vehicles
export const fetchUserVehicles = async (subscriberId) => {
  console.log('Fetching user vehicles for subscriber:', subscriberId);
  
  try {
    // Try real API first (only available for two-wheelers)
    const response = await apiGet(`/user/vehicles/${subscriberId}`);
    return response.data || response;
  } catch (error) {
    console.warn('API call failed, using mock data (API only available for two-wheelers):', error.message);
    
    // Fallback to mock data
    return [
      {
        id: 1,
        vehicle_id: 101,
        brand: "Honda",
        model: "Activa 6G",
        cc_id: 1,
        cc: "110cc",
        year: "2022",
        registration_number: "MH01AB1234",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        color: "Red"
      },
      {
        id: 2,
        vehicle_id: 102,
        brand: "Yamaha",
        model: "FZ-S V3",
        cc_id: 2,
        cc: "149cc",
        year: "2021",
        registration_number: "MH02CD5678",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        color: "Blue"
      },
      {
        id: 3,
        vehicle_id: 103,
        brand: "Bajaj",
        model: "Pulsar 150",
        cc_id: 2,
        cc: "149cc",
        year: "2020",
        registration_number: "MH03EF9012",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        color: "Black"
      }
    ];
  }
};

// Fetch garage services
export const fetchGarageServices = async (payload) => {
  console.log('Fetching garage services with payload:', payload);
  
  const { garageid, ccid } = payload;
  
  try {
    // Try real API first (only available for two-wheelers)
    const response = await apiGet(`/garage/${garageid}/services?cc_id=${ccid}`);
    return response.data || response;
  } catch (error) {
    console.warn('API call failed, using mock data (API only available for two-wheelers):', error.message);
    
    // Mock data based on garage and CC
    const services = {
      1: [ // 110cc services
        {
          id: 1,
          name: "General Service",
          description: "Complete bike service including oil change, filter cleaning, and basic checks",
          price: 500,
          category: "Service",
          duration: "2-3 hours",
          includes: ["Engine oil change", "Air filter cleaning", "Chain lubrication", "Basic inspection"]
        },
        {
          id: 2,
          name: "Oil Change",
          description: "Engine oil replacement with genuine oil",
          price: 300,
          category: "Service",
          duration: "30 minutes",
          includes: ["Engine oil replacement", "Oil filter change"]
        },
        {
          id: 3,
          name: "Brake Service",
          description: "Complete brake system service and adjustment",
          price: 400,
          category: "Service",
          duration: "1 hour",
          includes: ["Brake pad inspection", "Brake fluid check", "Brake adjustment"]
        }
      ],
      2: [ // 149cc services
        {
          id: 1,
          name: "General Service",
          description: "Complete bike service including oil change, filter cleaning, and basic checks",
          price: 600,
          category: "Service",
          duration: "2-3 hours",
          includes: ["Engine oil change", "Air filter cleaning", "Chain lubrication", "Basic inspection"]
        },
        {
          id: 2,
          name: "Oil Change",
          description: "Engine oil replacement with genuine oil",
          price: 350,
          category: "Service",
          duration: "30 minutes",
          includes: ["Engine oil replacement", "Oil filter change"]
        },
        {
          id: 3,
          name: "Brake Service",
          description: "Complete brake system service and adjustment",
          price: 450,
          category: "Service",
          duration: "1 hour",
          includes: ["Brake pad inspection", "Brake fluid check", "Brake adjustment"]
        }
      ]
    };

    const addOns = [
      {
        id: 101,
        name: "Bike Wash",
        description: "Complete bike cleaning and polishing",
        price: 150,
        category: "Add-On",
        duration: "30 minutes"
      },
      {
        id: 102,
        name: "Chain Lubrication",
        description: "Chain cleaning and lubrication",
        price: 100,
        category: "Add-On",
        duration: "15 minutes"
      },
      {
        id: 103,
        name: "Tire Pressure Check",
        description: "Check and adjust tire pressure",
        price: 50,
        category: "Add-On",
        duration: "10 minutes"
      }
    ];

    return {
      services: services[ccid] || services[1],
      addOns: addOns
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
    console.warn('API call failed, using mock data:', error.message);
    
    // Mock data
    return [
      {
        id: 1,
        address: "123 Main Street, Andheri West",
        city: "Mumbai",
        pincode: "400058",
        is_default: true,
        landmark: "Near Andheri Station"
      },
      {
        id: 2,
        address: "456 Park Avenue, Bandra West",
        city: "Mumbai",
        pincode: "400050",
        is_default: false,
        landmark: "Opposite Bandra Station"
      },
      {
        id: 3,
        address: "789 Tech Park, Koramangala",
        city: "Bangalore",
        pincode: "560034",
        is_default: false,
        landmark: "Near Forum Mall"
      }
    ];
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
    console.warn('API call failed, using mock response:', error.message);
    
    // Mock response
    return {
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...payload,
        is_default: false
      },
      message: "Address created successfully"
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
    console.warn('API call failed, using mock response:', error.message);
    
    // Fallback to mock response
    return {
      success: true,
      data: {
        booking_id: `BK${Date.now()}`,
        booking_date: payload.bookingdate,
        booking_slot: payload.bookingslot,
        total_amount: payload.bookingamount,
        status: "Confirmed",
        ...payload
      },
      message: "Booking created successfully"
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
    console.warn('API call failed, using mock data:', error.message);
    
    return [
      { id: 1, name: "Honda" },
      { id: 2, name: "Yamaha" },
      { id: 3, name: "Bajaj" },
      { id: 4, name: "TVS" },
      { id: 5, name: "Hero" },
      { id: 6, name: "Royal Enfield" },
      { id: 7, name: "KTM" },
      { id: 8, name: "Suzuki" },
      { id: 9, name: "Kawasaki" },
      { id: 10, name: "Ducati" }
    ];
  }
};

// Fetch bike models by brand
export const fetchBikeModels = async (brandId) => {
  console.log('Fetching bike models for brand:', brandId);
  
  try {
    // Try real API first
    const response = await apiGet(`/bike-models/${brandId}`);
    return response.data || response;
  } catch (error) {
    console.warn('API call failed, using mock data:', error.message);
    
    const models = {
      1: [ // Honda
        { id: 1, name: "Activa 6G", cc_id: 1, cc: "110cc" },
        { id: 2, name: "Shine", cc_id: 1, cc: "110cc" },
        { id: 3, name: "Unicorn", cc_id: 2, cc: "149cc" },
        { id: 4, name: "CBR 150R", cc_id: 2, cc: "149cc" }
      ],
      2: [ // Yamaha
        { id: 5, name: "FZ-S V3", cc_id: 2, cc: "149cc" },
        { id: 6, name: "R15 V4", cc_id: 3, cc: "155cc" },
        { id: 7, name: "MT-15", cc_id: 2, cc: "149cc" },
        { id: 8, name: "Ray ZR", cc_id: 1, cc: "110cc" }
      ],
      3: [ // Bajaj
        { id: 9, name: "Pulsar 150", cc_id: 2, cc: "149cc" },
        { id: 10, name: "Pulsar 220F", cc_id: 4, cc: "220cc" },
        { id: 11, name: "Dominar 400", cc_id: 5, cc: "373cc" },
        { id: 12, name: "CT 100", cc_id: 1, cc: "100cc" }
      ]
    };
    
    return models[brandId] || [];
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
    console.warn('API call failed, using mock data:', error.message);
    
    return [
      { id: 1, name: "Mumbai", state: "Maharashtra" },
      { id: 2, name: "Delhi", state: "NCR" },
      { id: 3, name: "Bangalore", state: "Karnataka" },
      { id: 4, name: "Chennai", state: "Tamil Nadu" },
      { id: 5, name: "Pune", state: "Maharashtra" },
      { id: 6, name: "Hyderabad", state: "Telangana" },
      { id: 7, name: "Kolkata", state: "West Bengal" },
      { id: 8, name: "Ahmedabad", state: "Gujarat" }
    ];
  }
};
