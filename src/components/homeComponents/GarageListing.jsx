import React, { useState, useEffect } from 'react';
import FilterSystem from './FilterSystem';
import GarageCard from './GarageCard';
import { getGaragesByServiceCategory } from '../../services/garageService';
import { getStoredLocationData, hasLocationData } from '../../utils/geolocation';

const GarageListing = ({ selectedCity, filterData, onGarageClick, setCurrentPage, onShowLoginPopup }) => {
  const [garages, setGarages] = useState([]);
  const [filteredGarages, setFilteredGarages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationReady, setLocationReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Geolocation setup
  useEffect(() => {
    // Check if we already have location data
    if (hasLocationData()) {
      setLocationReady(true);
      return;
    }

    // Set fallback coordinates if no location data available
    const { latitude, longitude } = getStoredLocationData();
    if (!latitude || !longitude) {
      sessionStorage.setItem("latitude", "17.74162");
      sessionStorage.setItem("longitude", "73.8567");
    }
    
    setLocationReady(true);
  }, []);

  // Get city-specific coordinates
  const getCityCoordinates = (cityName) => {
    const cityCoords = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Nagpur': { lat: 21.1458, lng: 79.0882 }
    };
    
    return cityCoords[cityName] || { lat: 18.5204, lng: 73.8567 }; // Default to Pune
  };

  // Fetch garages when filters or location change
  useEffect(() => {
    if (!locationReady) return;

    const fetchGarages = async () => {
      setLoading(true);
      try {
        // Use city-specific coordinates instead of stored location
        const cityCoords = getCityCoordinates(selectedCity);
        const lat = cityCoords.lat;
        const lng = cityCoords.lng;

        // Special case: Add trailing space for Bangalore to match old website
        let location = selectedCity;
        if (location === 'Bangalore') {
          location = 'Bangalore ';
        }
        
        const requestData = {
          location: location,
          latitude: lat,
          longitude: lng,
          filter: {
            sort: filters?.sort || [],
            ratings: filters?.ratings || [],
            distence: filters?.distance || [], // Keep old spelling like old website
            services: filters?.services || [],
          },
        };

        console.log('🔄 Fetching garages for:', selectedCity, 'with coordinates:', lat, lng);
        console.log('🔄 Request data:', requestData);
        
        const response = await getGaragesByServiceCategory(requestData);
        console.log('✅ Garage response:', response);
        
        if (response && response.data && response.data.length > 0) {
          console.log('✅ Found', response.data.length, 'garages for', selectedCity);
          setGarages(response.data);
          setFilteredGarages(response.data);
        } else {
          console.warn('⚠️ No garage data received from API for', selectedCity);
          setGarages([]);
          setFilteredGarages([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch garages from API:", error);
        console.log('🔄 No garages available for', selectedCity);
        setGarages([]);
        setFilteredGarages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, [filters, locationReady, selectedCity]);

  const handleFilterApply = (newFilters) => {
    console.log("Filters received from child:", newFilters);
    setFilters(newFilters);
  };

  const handleGarageClick = (garage) => {
    onGarageClick(garage);
  };

  if (loading) {
    return (
      <div className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading garages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Find Verified Garages Near You
          </h2>
          <p className="text-xl text-gray-400">Choose from our network of trusted mechanics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSystem
              filterData={filterData}
              onApplyFilters={handleFilterApply}
              isMobile={isMobile}
            />
          </div>

          {/* Garage Grid */}
          <div className="lg:col-span-3">
            {filteredGarages.length === 0 ? (
              <div className="text-center py-12">
                {garages.length === 0 ? (
                  // No garages available for this city
                  <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Coming Soon!</h3>
                    <p className="text-gray-400 text-lg mb-4">
                      We are expanding our services to <span className="text-red-500 font-semibold">{selectedCity}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Stay tuned! We'll be launching in your city soon.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Explore Other Cities
                      </button>
                    </div>
                  </div>
                ) : (
                  // Garages exist but filters removed them
                  <div>
                    <p className="text-gray-400 text-lg">No garages found matching your criteria.</p>
                    <button
                      onClick={() => setFilters(null)}
                      className="mt-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGarages.map((garage) => (
                  <GarageCard
                    key={garage.id}
                    garage={garage}
                    onClick={handleGarageClick}
                    setCurrentPage={setCurrentPage}
                    onShowLoginPopup={onShowLoginPopup}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GarageListing;