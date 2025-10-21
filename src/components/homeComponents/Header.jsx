import React, { useState, useEffect } from 'react';
import ServXLogo from '../../assets/ServXLogo-removebg-preview.png';
import { ChevronDownIcon, MagnifyingGlassIcon, UserIcon, MapPinIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { getCurrentLocation, getCityFromCoordinates, storeLocationData, getStoredLocationData } from '../../utils/geolocation';
import { isAuthenticated, clearAuthData } from '../../services/authService';
import CitySelectionPopup from './CitySelectionPopup';

const Header = ({ selectedCity, onCityChange, setCurrentPage, scrollToTop, onBackToMain, isDetectingLocation }) => {
  const [isCityPopupOpen, setIsCityPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    clearAuthData();
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    if (onBackToMain && page === 'home') {
      onBackToMain();
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const handleAuthStateChange = (e) => {
      console.log('🔍 Auth state changed:', e.detail);
      setIsLoggedIn(e.detail.isLoggedIn);
    };

    const handleStorageChange = (e) => {
      if (e.key === "selectedCity") {
        onCityChange(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, [onCityChange]);

  // Poll session storage every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const cityFromStorage = sessionStorage.getItem("selectedCity");
      if (cityFromStorage !== selectedCity) {
        // Convert localities to main cities
        let correctedCity = cityFromStorage;
        if (cityFromStorage === "Mulshi" || cityFromStorage === "Hinjewadi" || cityFromStorage === "Wakad" || cityFromStorage === "Baner") {
          correctedCity = "Pune";
          sessionStorage.setItem("selectedCity", "Pune");
        }
        onCityChange(correctedCity);
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
      <header className="bg-black shadow-lg border-b border-gray-800 fixed w-full top-0 z-50 mobile-menu-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Group: Logo + Search Bar */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <img
                src={ServXLogo}
                alt="ServX24 logo"
                className="h-6 md:h-6 sm:h-6 w-auto cursor-pointer"
                onClick={() => {
                  setCurrentPage('home');
                  if (onBackToMain) {
                    onBackToMain();
                  }
                  if (scrollToTop) {
                    scrollToTop();
                  }
                }}
              />
              <div className="text-white text-xs md:text-sm sm:text-xs font-medium mt-1 cursor-pointer text-center">
                Search.Compare.Book
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex w-60 lg:w-80">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for garages, services..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right Group: Navigation + City Selection + Login */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <a 
                href="#" 
                onClick={() => {
                  setCurrentPage('home');
                  if (onBackToMain) {
                    onBackToMain();
                  }
                }}
                className="text-white hover:text-red-500 transition-colors duration-200 font-medium text-sm lg:text-base"
              >
                Home
              </a>
              <a 
                href="#" 
                onClick={() => setCurrentPage('about')}
                className="text-white hover:text-red-500 transition-colors duration-200 font-medium text-sm lg:text-base"
              >
                About
              </a>
              <a 
                href="#" 
                onClick={() => setCurrentPage('contact')}
                className="text-white hover:text-red-500 transition-colors duration-200 font-medium text-sm lg:text-base"
              >
                Contact
              </a>
            </div>

            {/* City Selection */}
            <div className="hidden md:flex">
              <button
                onClick={() => setIsCityPopupOpen(true)}
                disabled={isDetectingLocation}
                className="flex items-center space-x-1 lg:space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-2 lg:px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs lg:text-sm"
              >
                <MapPinIcon className="w-3 h-3 lg:w-4 lg:h-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                <span className="hidden lg:inline">
                  {isDetectingLocation ? 'Detecting...' : (selectedCity || 'Select City')}
                </span>
                <span className="lg:hidden">
                  {isDetectingLocation ? '...' : (selectedCity || 'City')}
                </span>
                {isDetectingLocation ? (
                  <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2" style={{ borderColor: '#ff3864', borderTopColor: '#cc1e3a' }}></div>
                ) : (
                  <ChevronDownIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </button>
            </div>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className="text-white hover:text-red-500 transition-colors duration-200"
                  title="Profile"
                >
                  <UserIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-red-500 transition-colors duration-200"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('login')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-white hover:text-red-500 p-2 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 shadow-lg">
          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for garages, services..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => handleMobileNavClick('home')}
              className="flex items-center w-full text-left text-white hover:text-red-500 py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => handleMobileNavClick('about')}
              className="flex items-center w-full text-left text-white hover:text-red-500 py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">About</span>
            </button>
            <button
              onClick={() => handleMobileNavClick('contact')}
              className="flex items-center w-full text-left text-white hover:text-red-500 py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">Contact</span>
            </button>
          </div>

          {/* Location Section */}
          <div className="px-4 py-3 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Location</span>
            </div>
            <button
              onClick={() => {
                setIsCityPopupOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-red-500" />
                <span>{selectedCity || 'Select City'}</span>
              </div>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>

          {/* User Section */}
          <div className="px-4 py-3 border-t border-gray-800">
            {isLoggedIn ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left text-white hover:text-red-500 py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <UserIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left text-white hover:text-red-500 py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16"></div>

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
