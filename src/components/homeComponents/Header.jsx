import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getCurrentLocation, getCityFromCoordinates, storeLocationData, getStoredLocationData } from '../../utils/geolocation';
import CitySelectionPopup from './CitySelectionPopup';

const Header = ({ selectedCity, onCityChange }) => {
  const [isCityPopupOpen, setIsCityPopupOpen] = useState(false);

  // Listen for session storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "selectedCity") {
        onCityChange(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [onCityChange]);

  // Poll session storage every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const cityFromStorage = sessionStorage.getItem("selectedCity");
      if (cityFromStorage !== selectedCity) {
        onCityChange(cityFromStorage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [selectedCity, onCityChange]);

  const handleCitySelect = (cityName) => {
    sessionStorage.setItem("selectedCity", cityName);
    onCityChange(cityName);
    setIsCityPopupOpen(false);
  };

  const handleGeolocation = async () => {
    try {
      // Show loading state
      const locationButton = document.querySelector('[data-location-button]');
      if (locationButton) {
        locationButton.textContent = '📍 Getting location...';
        locationButton.disabled = true;
      }

      // Get current location
      const { latitude, longitude } = await getCurrentLocation();
      
      // Get city from coordinates
      const cityData = await getCityFromCoordinates(latitude, longitude);
      
      // Store location data
      storeLocationData(latitude, longitude, cityData);
      
      // Update city
      onCityChange(cityData.city);
      
      console.log('Location detected:', cityData);
      
    } catch (error) {
      console.error('Geolocation failed:', error);
      
      // Set fallback city
      const fallbackCity = "Pune";
      sessionStorage.setItem("selectedCity", fallbackCity);
      onCityChange(fallbackCity);
      
      // Show error message
      alert('Unable to detect your location. Please select a city manually.');
    } finally {
      // Reset button state
      const locationButton = document.querySelector('[data-location-button]');
      if (locationButton) {
        locationButton.textContent = '📍 Use my location';
        locationButton.disabled = false;
      }
    }
  };



  return (
    <div>
      <header className="bg-black shadow-lg border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Group: Logo + Search Bar */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <h1 className="text-xl font-bold text-white cursor-pointer hover:text-pink-500 transition-colors">
              BikeDoot
            </h1>

            {/* Search Bar */}
            <div className="hidden md:flex w-80">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for garages, services..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>
            </div>
          </div>

          {/* Right Group: City Selection + Login */}
          <div className="flex items-center space-x-4">
            {/* City Selection */}
            <div className="hidden md:flex">
              <button
                onClick={() => setIsCityPopupOpen(true)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <MapPinIcon className="w-4 h-4 text-pink-500" />
                <span>{selectedCity || 'Select City'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>

            {/* User Menu */}
            <button className="text-white hover:text-pink-500 transition-colors duration-200">
              <UserIcon className="w-6 h-6" />
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-white hover:text-pink-500 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

             {/* Mobile City Selection */}
       <div className="md:hidden border-t border-gray-800 p-4">
         <button
           onClick={() => setIsCityPopupOpen(true)}
           className="flex items-center justify-between w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
         >
           <div className="flex items-center space-x-2">
             <MapPinIcon className="w-4 h-4 text-pink-500" />
             <span>{selectedCity || 'Select City'}</span>
           </div>
           <ChevronDownIcon className="w-4 h-4" />
         </button>
               </div>
      </header>

      {/* City Selection Popup */}
      <CitySelectionPopup
        isOpen={isCityPopupOpen}
        onClose={() => setIsCityPopupOpen(false)}
        onCitySelect={handleCitySelect}
        selectedCity={selectedCity}
      />
    </div>
  );
};

export default Header;
