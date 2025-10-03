import React, { useState, useEffect, useRef } from 'react';
import FilterSystem, { SortByDropdown } from '../homeComponents/FilterSystem';
import GarageCard from '../homeComponents/GarageCard';
import ScrollToTop from '../ScrollToTop';
import VehicleTypeSelector from '../VehicleTypeSelector';
import { getGaragesByServiceCategory } from '../../services/garageService';
import { getStoredLocationData, hasLocationData, getCurrentLocation, getCityFromCoordinates, storeLocationData } from '../../utils/geolocation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const TwoWheelerGarages = ({ selectedCity, filterData, onGarageClick, onBackToMain, onVehicleTypeChange, onShowLoginPopup }) => {
  const [garages, setGarages] = useState([]);
  const [filteredGarages, setFilteredGarages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationReady, setLocationReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [garageType, setGarageType] = useState('all'); // 'all' or 'authorized'
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState(null);
  const brandDropdownRef = useRef(null);

  // Two-wheeler brands for authorized service centers
  const twoWheelerBrands = [
    'Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 
    'KTM', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'Harley Davidson',
    'Aprilia', 'Triumph', 'Benelli', 'Jawa', 'Mahindra'
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close brand dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setIsBrandDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Geolocation setup with improved handling
  useEffect(() => {
    const initializeLocation = async () => {
      // Check if we already have location data
      if (hasLocationData()) {
        console.log("📍 Using existing location data in garage component");
        setLocationReady(true);
        return;
      }

      // Try to get fresh location data
      try {
        console.log("📍 No location data found, attempting to get current location...");
        const { latitude, longitude } = await getCurrentLocation();
        
        // Try to get city information
        try {
          const cityData = await getCityFromCoordinates(latitude, longitude);
          storeLocationData(latitude, longitude, cityData);
          console.log("📍 Location and city data stored:", { latitude, longitude, city: cityData.city });
        } catch (cityError) {
          console.warn("📍 Failed to get city data, storing coordinates only:", cityError);
          sessionStorage.setItem("latitude", latitude.toString());
          sessionStorage.setItem("longitude", longitude.toString());
        }
        
        setLocationReady(true);
      } catch (error) {
        console.error("📍 Failed to get location, using fallback:", error);
        // Set fallback coordinates
        sessionStorage.setItem("latitude", "18.5204");
        sessionStorage.setItem("longitude", "73.8567");
        sessionStorage.setItem("selectedCity", "Pune");
        setLocationReady(true);
      }
    };

    initializeLocation();
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
          vehicleType: 'two-wheeler', // Keep for new website logic
          garageType: garageType || 'all', // Keep for new website logic
          selectedBrand: selectedBrand || '', // Keep for new website logic
          filter: {
            sort: filters?.sort || [],
            ratings: filters?.ratings || [],
            distence: filters?.distance || [], // Use old spelling like old website
            services: filters?.services || [],
            brands: filters?.brands || [],
          },
        };

        const response = await getGaragesByServiceCategory(requestData);
        console.log('🔍 Full API response:', response);
        console.log('🔍 Response data:', response?.data);
        console.log('🔍 Response type:', typeof response);
        console.log('🔍 Response keys:', Object.keys(response || {}));
        
        // Handle different response structures
        let garagesData = [];
        if (response?.data) {
          garagesData = response.data;
        } else if (Array.isArray(response)) {
          garagesData = response;
        } else if (response?.garages) {
          garagesData = response.garages;
        }
        
        console.log('🔍 Processed garages data:', garagesData);
        setGarages(garagesData);
        setFilteredGarages(garagesData);
        
        // Only set noResultsMessage if there are actually no garages
        if (garagesData.length === 0) {
          setNoResultsMessage(response?.message || "No garages found in your area");
        } else {
          setNoResultsMessage(null);
        }
      } catch (error) {
        console.error("Failed to fetch two-wheeler garages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, [filters, locationReady, selectedCity, garageType, selectedBrand]);

  // Sort garages when sortBy changes
  useEffect(() => {
    if (!garages.length) return;

    const sortedGarages = [...garages].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating-high':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-low':
          return (a.rating || 0) - (b.rating || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'service-time':
          return (a.serviceTime || 0) - (b.serviceTime || 0);
        default:
          return 0;
      }
    });

    setFilteredGarages(sortedGarages);
  }, [garages, sortBy]);

  const handleFilterApply = (newFilters) => {
    console.log("Filters received from child:", newFilters);
    setFilters(newFilters);
    
    // If brands are selected from FilterSystem, automatically switch to authorized mode
    if (newFilters && newFilters.brands && newFilters.brands.length > 0) {
      setGarageType('authorized');
      setSelectedBrand(''); // Clear the garage component's brand selection
    }
  };

  const handleClearFilters = () => {
    setFilters(null);
    setGarageType('all');
    setSelectedBrand('');
    setIsBrandDropdownOpen(false);
  };

  const handleGarageClick = (garage) => {
    onGarageClick(garage);
  };

  const handleGarageTypeChange = (type) => {
    setGarageType(type);
    if (type === 'all') {
      setSelectedBrand('');
    }
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setIsBrandDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#ff3864', borderTopColor: '#cc1e3a' }}></div>
            <p className="text-gray-400 mt-4">Loading two-wheeler garages...</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('🔍 Component render - garages:', garages.length, 'filteredGarages:', filteredGarages.length, 'loading:', loading, 'noResultsMessage:', noResultsMessage);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Two Wheeler Garages Section */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Two Wheeler Garages Near You
            </h2>
            <p className="text-lg text-gray-400">Find specialized garages for bikes and scooters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterSystem
                filterData={filterData}
                onApplyFilters={handleFilterApply}
                isMobile={isMobile}
                onClearAll={handleClearFilters}
              />
            </div>

            {/* Garage Grid */}
            <div className="lg:col-span-3">
              {/* Garage Type Toggle and Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                {/* Left Group: Garage Type Toggle + Brand Dropdown */}
                <div className="flex items-center gap-4">
                  {/* Garage Type Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => handleGarageTypeChange('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        garageType === 'all'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleGarageTypeChange('authorized')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        garageType === 'authorized'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Authorized
                    </button>
                  </div>

                  {/* Brand Dropdown (only for authorized) */}
                  {garageType === 'authorized' && (
                    <div className="relative" ref={brandDropdownRef}>
                      <button
                        onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                        className="flex items-center space-x-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      >
                        <span className="text-sm font-medium">
                          {selectedBrand || 'Select Brand'}
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isBrandDropdownOpen && (
                        <div className="absolute z-50 right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                          <div className="py-2 pt-3">
                            {twoWheelerBrands.map((brand) => (
                              <button
                                key={brand}
                                onClick={() => handleBrandSelect(brand)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                                  selectedBrand === brand ? 'text-red-400 bg-gray-700' : 'text-gray-300'
                                }`}
                              >
                                {brand}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Group: Vehicle Type Selector + Sort By Dropdown */}
                <div className="flex items-center gap-4">
                  <VehicleTypeSelector 
                    currentVehicleType="two-wheeler"
                    onVehicleTypeChange={onVehicleTypeChange}
                  />
                  <SortByDropdown 
                    currentSort={sortBy} 
                    onSortChange={setSortBy} 
                  />
                </div>
              </div>

              {filteredGarages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No two-wheeler garages found matching your criteria.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {noResultsMessage ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                        <div className="text-6xl mb-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          🔧
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Garages Found</h3>
                        <p className="text-gray-400 mb-4">{noResultsMessage}</p>
                        <button
                          onClick={handleClearFilters}
                          className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredGarages.map((garage) => (
                        <GarageCard
                          key={garage.id}
                          garage={garage}
                          onClick={handleGarageClick}
                          setCurrentPage={onBackToMain}
                          onShowLoginPopup={onShowLoginPopup}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default TwoWheelerGarages;
