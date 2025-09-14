import React, { useState } from 'react';
import { getCurrentLocation, getCityFromCoordinates, storeLocationData, getStoredLocationData } from '../../utils/geolocation';

const LocationTest = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testGeolocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing geolocation...');
      
      // Get current location
      const coords = await getCurrentLocation();
      console.log('Coordinates obtained:', coords);
      
      // Get city from coordinates
      const cityData = await getCityFromCoordinates(coords.latitude, coords.longitude);
      console.log('City data obtained:', cityData);
      
      // Store location data
      storeLocationData(coords.latitude, coords.longitude, cityData);
      
      // Get stored data
      const storedData = getStoredLocationData();
      console.log('Stored location data:', storedData);
      
      setLocationData({
        coordinates: coords,
        cityData,
        storedData
      });
      
    } catch (err) {
      console.error('Geolocation test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showStoredData = () => {
    const storedData = getStoredLocationData();
    setLocationData({ storedData });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="text-white font-semibold mb-2">Location Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testGeolocation}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Geolocation'}
        </button>
        
        <button
          onClick={showStoredData}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
        >
          Show Stored Data
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-2">
          Error: {error}
        </div>
      )}

      {locationData && (
        <div className="text-xs text-gray-300 space-y-1">
          <div><strong>Coordinates:</strong></div>
          {locationData.coordinates && (
            <div className="pl-2">
              Lat: {locationData.coordinates.latitude.toFixed(6)}<br/>
              Lng: {locationData.coordinates.longitude.toFixed(6)}
            </div>
          )}
          
          <div><strong>City Data:</strong></div>
          {locationData.cityData && (
            <div className="pl-2">
              City: {locationData.cityData.city}<br/>
              State: {locationData.cityData.state}<br/>
              Country: {locationData.cityData.country}
            </div>
          )}
          
          <div><strong>Stored Data:</strong></div>
          {locationData.storedData && (
            <div className="pl-2">
              City: {locationData.storedData.selectedCity}<br/>
              Lat: {locationData.storedData.latitude}<br/>
              Lng: {locationData.storedData.longitude}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationTest;
