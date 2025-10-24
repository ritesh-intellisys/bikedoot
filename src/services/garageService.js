import { apiPost } from '../utils/api';

export const getGaragesByServiceCategory = async (requestData) => {
  console.log('Fetching garages with request data:', requestData);
  
  try {
    // Create API request data matching old website structure exactly
    // Note: Old website uses "Bangalore " (with trailing space), so we need to match that
    let location = requestData.location || sessionStorage.getItem("selectedCity") || 'Pune';
    
    // Special case: Add trailing space for Bangalore to match old website
    if (location === 'Bangalore') {
      location = 'Bangalore ';
    }
    const apiRequestData = {
      location: location,
      latitude: parseFloat(requestData.latitude),
      longitude: parseFloat(requestData.longitude),
      filter: {
        sort: requestData.filter?.sort || [],
        ratings: requestData.filter?.ratings || [],
        distence: requestData.filter?.distance || [], // Keep old spelling like old website
        services: requestData.filter?.services || [],
      }
    };
    
    // Validate required fields before making the request
    if (!apiRequestData.location || !apiRequestData.latitude || !apiRequestData.longitude) {
      throw new Error(`Missing required fields: location=${apiRequestData.location}, latitude=${apiRequestData.latitude}, longitude=${apiRequestData.longitude}`);
    }
    
    console.log('🔄 Original requestData:', requestData);
    console.log('🔄 Processed location:', location);
    console.log('🔄 Attempting real API call to /listgarage/ with data:', apiRequestData);
    console.log('🔄 Request body:', JSON.stringify(apiRequestData));
    
    // Use the API utility for consistent error handling
    const result = await apiPost('/listgarage/', apiRequestData);
    console.log('✅ Real API response:', result);
    
    // Check if the API returned an error (like "City not found")
    if (result.status === 'error') {
      console.log('⚠️ API returned error:', result.message);
      // Return empty data for "Coming Soon" message
      return {
        status: 'success',
        message: 'No garages available',
        data: []
      };
    }
    
    return result;
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    console.error('❌ Full error:', error);
    
    // Return empty data instead of throwing error
    return {
      status: 'success',
      message: 'No garages available',
      data: []
    };
  }
};