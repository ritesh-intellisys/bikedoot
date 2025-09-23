// API service for fetching individual garage details
import { apiGet } from '../utils/api';

// Fetch garage by ID
export const fetchGarageById = async (garageId) => {
  console.log('🔍 Fetching garage details for ID:', garageId);
  
  try {
    // Try real API first - using correct endpoint from old website
    const response = await apiGet(`/garage/?id=${garageId}`);
    console.log('🔍 API response for garage details:', response);
    
    if (response.status) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.warn('🔍 API call failed for garage details:', error.message);
    // Return null if API fails
    return null;
  }
};
