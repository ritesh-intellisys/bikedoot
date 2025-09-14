import React, { useState, useEffect } from 'react';
import FilterSystem from './FilterSystem';
import GarageCard from './GarageCard';
import { getGaragesByServiceCategory } from '../../services/garageService';
import { getStoredLocationData, hasLocationData } from '../../utils/geolocation';

const GarageListing = ({ selectedCity, filterData, onGarageClick }) => {
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

  // Fetch garages when filters or location change
  useEffect(() => {
    if (!locationReady) return;

    const fetchGarages = async () => {
      setLoading(true);
      try {
        const { latitude, longitude } = getStoredLocationData();
        const lat = latitude || 17.74162;
        const lng = longitude || 73.8567;

        const requestData = {
          location: selectedCity,
          latitude: lat,
          longitude: lng,
          filter: {
            sort: filters?.sort || [],
            ratings: filters?.ratings || [],
            distance: filters?.distance || [],
            services: filters?.services || [],
          },
        };

        const response = await getGaragesByServiceCategory(requestData);
        setGarages(response?.data || []);
        setFilteredGarages(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch garages:", error);
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
                <p className="text-gray-400 text-lg">No garages found matching your criteria.</p>
                <button
                  onClick={() => setFilters(null)}
                  className="mt-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGarages.map((garage) => (
                  <GarageCard
                    key={garage.id}
                    garage={garage}
                    onClick={handleGarageClick}
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
