// Geolocation utility functions
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  });
};

// Simple reverse geocoding using coordinates to determine approximate city
export const getCityFromCoordinates = async (latitude, longitude) => {
  try {
    // Using a free reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    // Return the most relevant location name
    return {
      city: data.city || data.locality || data.principalSubdivision,
      state: data.principalSubdivision,
      country: data.countryName,
      fullAddress: data.localityInfo?.administrative?.[0]?.name || data.city
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to manual city detection based on coordinates
    return getFallbackCity(latitude, longitude);
  }
};

// Fallback city detection based on coordinates (major Indian cities)
const getFallbackCity = (latitude, longitude) => {
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 }
  ];

  let closestCity = cities[0];
  let minDistance = Infinity;

  cities.forEach(city => {
    const distance = Math.sqrt(
      Math.pow(latitude - city.lat, 2) + Math.pow(longitude - city.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  });

  return {
    city: closestCity.name,
    state: getStateFromCity(closestCity.name),
    country: 'India',
    fullAddress: closestCity.name
  };
};

const getStateFromCity = (cityName) => {
  const cityStateMap = {
    'Mumbai': 'Maharashtra',
    'Delhi': 'NCR',
    'Bangalore': 'Karnataka',
    'Chennai': 'Tamil Nadu',
    'Pune': 'Maharashtra',
    'Hyderabad': 'Telangana',
    'Kolkata': 'West Bengal',
    'Ahmedabad': 'Gujarat'
  };
  return cityStateMap[cityName] || 'Unknown';
};

// Store location data in session storage
export const storeLocationData = (latitude, longitude, cityData) => {
  sessionStorage.setItem('latitude', latitude.toString());
  sessionStorage.setItem('longitude', longitude.toString());
  sessionStorage.setItem('selectedCity', cityData.city);
  sessionStorage.setItem('locationData', JSON.stringify(cityData));
};

// Get stored location data
export const getStoredLocationData = () => {
  const latitude = sessionStorage.getItem('latitude');
  const longitude = sessionStorage.getItem('longitude');
  const selectedCity = sessionStorage.getItem('selectedCity');
  const locationData = sessionStorage.getItem('locationData');

  return {
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    selectedCity,
    locationData: locationData ? JSON.parse(locationData) : null
  };
};

// Check if location data is available
export const hasLocationData = () => {
  const { latitude, longitude } = getStoredLocationData();
  return latitude !== null && longitude !== null;
};
