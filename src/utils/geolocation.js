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
    // First try to determine the main city using coordinate-based detection
    const mainCity = getMainCityFromCoordinates(latitude, longitude);
    if (mainCity) {
      return mainCity;
    }

    // If coordinate-based detection fails, use reverse geocoding API
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    // Map localities to main cities
    const mainCityFromLocality = mapLocalityToMainCity(data.locality || data.city);
    
    return {
      city: mainCityFromLocality || data.city || data.principalSubdivision,
      state: data.principalSubdivision,
      country: data.countryName,
      fullAddress: mainCityFromLocality || data.city
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to manual city detection based on coordinates
    return getFallbackCity(latitude, longitude);
  }
};

// Get main city from coordinates with expanded coverage
const getMainCityFromCoordinates = (latitude, longitude) => {
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, radius: 0.5 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, radius: 0.8 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, radius: 0.6 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 0.5 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, radius: 0.8 }, // Increased radius for Pune
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, radius: 0.6 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 0.5 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, radius: 0.5 },
    { name: 'Pune', lat: 18.6035, lng: 73.7310, radius: 0.3 }, // Mulshi area mapped to Pune
    { name: 'Pune', lat: 18.4500, lng: 73.8000, radius: 0.3 }, // Additional Pune coverage
  ];

  for (const city of cities) {
    const distance = Math.sqrt(
      Math.pow(latitude - city.lat, 2) + Math.pow(longitude - city.lng, 2)
    );
    if (distance <= city.radius) {
      return {
        city: city.name,
        state: getStateFromCity(city.name),
        country: 'India',
        fullAddress: city.name
      };
    }
  }
  
  return null;
};

// Map localities to main cities
const mapLocalityToMainCity = (locality) => {
  if (!locality) return null;
  
  const localityMap = {
    // Pune localities
    'Mulshi': 'Pune',
    'Hinjewadi': 'Pune',
    'Wakad': 'Pune',
    'Baner': 'Pune',
    'Aundh': 'Pune',
    'Koregaon Park': 'Pune',
    'Viman Nagar': 'Pune',
    'Kharadi': 'Pune',
    'Hadapsar': 'Pune',
    'Magarpatta': 'Pune',
    'Kothrud': 'Pune',
    'Katraj': 'Pune',
    'Bibwewadi': 'Pune',
    'Swargate': 'Pune',
    'Shivajinagar': 'Pune',
    'Deccan': 'Pune',
    'Camp': 'Pune',
    'Pimpri': 'Pune',
    'Chinchwad': 'Pune',
    'Nigdi': 'Pune',
    'Akurdi': 'Pune',
    'Ravet': 'Pune',
    'Tathawade': 'Pune',
    'Bhosari': 'Pune',
    'Chakan': 'Pune',
    'Talegaon': 'Pune',
    'Lonavala': 'Pune',
    'Khandala': 'Pune',
    
    // Mumbai localities
    'Andheri': 'Mumbai',
    'Bandra': 'Mumbai',
    'Powai': 'Mumbai',
    'Malad': 'Mumbai',
    'Borivali': 'Mumbai',
    'Thane': 'Mumbai',
    'Navi Mumbai': 'Mumbai',
    'Vashi': 'Mumbai',
    'Nerul': 'Mumbai',
    'Belapur': 'Mumbai',
    'Kalyan': 'Mumbai',
    'Dombivli': 'Mumbai',
    'Ulhasnagar': 'Mumbai',
    'Badlapur': 'Mumbai',
    'Ambernath': 'Mumbai',
    
    // Delhi localities
    'Gurgaon': 'Delhi',
    'Noida': 'Delhi',
    'Faridabad': 'Delhi',
    'Ghaziabad': 'Delhi',
    'Greater Noida': 'Delhi',
    'Dwarka': 'Delhi',
    'Rohini': 'Delhi',
    'Pitampura': 'Delhi',
    'Janakpuri': 'Delhi',
    'Lajpat Nagar': 'Delhi',
    'Karol Bagh': 'Delhi',
    'Connaught Place': 'Delhi',
    'CP': 'Delhi',
    
    // Bangalore localities
    'Whitefield': 'Bangalore',
    'Electronic City': 'Bangalore',
    'Marathahalli': 'Bangalore',
    'Koramangala': 'Bangalore',
    'Indiranagar': 'Bangalore',
    'HSR Layout': 'Bangalore',
    'BTM Layout': 'Bangalore',
    'JP Nagar': 'Bangalore',
    'Banashankari': 'Bangalore',
    'Malleshwaram': 'Bangalore',
    'Rajajinagar': 'Bangalore',
    'Vijayanagar': 'Bangalore',
    'Yeshwanthpur': 'Bangalore',
    'Hebbal': 'Bangalore',
    'Yelahanka': 'Bangalore',
    
    // Chennai localities
    'Anna Nagar': 'Chennai',
    'T. Nagar': 'Chennai',
    'Adyar': 'Chennai',
    'Velachery': 'Chennai',
    'Tambaram': 'Chennai',
    'Chrompet': 'Chennai',
    'Pallavaram': 'Chennai',
    'St. Thomas Mount': 'Chennai',
    'Guindy': 'Chennai',
    'Egmore': 'Chennai',
    'Mylapore': 'Chennai',
    'Alwarpet': 'Chennai',
    'Nungambakkam': 'Chennai',
    'Kilpauk': 'Chennai',
    'Aminjikarai': 'Chennai',
    
    // Hyderabad localities
    'Gachibowli': 'Hyderabad',
    'HITEC City': 'Hyderabad',
    'Kondapur': 'Hyderabad',
    'Madhapur': 'Hyderabad',
    'Jubilee Hills': 'Hyderabad',
    'Banjara Hills': 'Hyderabad',
    'Secunderabad': 'Hyderabad',
    'Begumpet': 'Hyderabad',
    'Ameerpet': 'Hyderabad',
    'Kukatpally': 'Hyderabad',
    'Miyapur': 'Hyderabad',
    'Bachupally': 'Hyderabad',
    'Nizampet': 'Hyderabad',
    'BHEL': 'Hyderabad',
    'Patancheru': 'Hyderabad',
  };
  
  return localityMap[locality] || null;
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
  // Convert locality to main city before storing
  const mainCity = mapLocalityToMainCity(cityData.city) || cityData.city;
  
  sessionStorage.setItem('latitude', latitude.toString());
  sessionStorage.setItem('longitude', longitude.toString());
  sessionStorage.setItem('selectedCity', mainCity);
  sessionStorage.setItem('locationData', JSON.stringify({ ...cityData, city: mainCity }));
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

// Clean up and correct stored location data
export const cleanupLocationData = () => {
  const storedCity = sessionStorage.getItem('selectedCity');
  if (storedCity) {
    const correctedCity = mapLocalityToMainCity(storedCity) || storedCity;
    if (correctedCity !== storedCity) {
      sessionStorage.setItem('selectedCity', correctedCity);
      console.log(`Corrected city from "${storedCity}" to "${correctedCity}"`);
    }
  }
};
