import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSprayCan, 
  faStar, 
  faMapPin, 
  faPhone, 
  faClock, 
  faCar, 
  faMotorcycle,
  faTruck,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  MapPinIcon, 
  PhoneIcon, 
  CalendarDaysIcon,
  ChevronDownIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const WashingCenterDetail = ({ center, onClose, onBookNow }) => {
  const { theme } = useTheme();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTab, setSelectedTab] = useState('about');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [showTimeMenu, setShowTimeMenu] = useState(false);

  if (!center) return null;

  // Time slots for booking
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Helper functions
  const getSanitizedPhone = () => {
    return center.phone ? center.phone.replace(/\D/g, '') : '';
  };

  const handleDirectionClick = () => {
    const address = encodeURIComponent(center.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : theme === 'light' ? 'text-gray-300' : 'text-gray-600'
        }`}
      />
    ));
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'car':
        return faCar;
      case 'bike':
        return faMotorcycle;
      case 'truck':
        return faTruck;
      default:
        return faCar;
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'basic-wash':
        return '🧽';
      case 'premium-detailing':
        return '✨';
      case 'ceramic-coating':
        return '🛡️';
      case 'eco-friendly':
        return '🌱';
      case 'bike-specific':
        return '🏍️';
      case 'interior':
        return '🪑';
      case 'express':
        return '⚡';
      case 'luxury':
        return '💎';
      default:
        return '🧽';
    }
  };

  const getPriceRangeColor = (priceRange) => {
    switch (priceRange) {
      case 'budget':
        return 'text-green-400';
      case 'mid-range':
        return 'text-yellow-400';
      case 'premium':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriceRangeLabel = (priceRange) => {
    switch (priceRange) {
      case 'budget':
        return 'Budget Friendly';
      case 'mid-range':
        return 'Mid-Range';
      case 'premium':
        return 'Premium';
      default:
        return 'Standard';
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
      {/* Header */}
      <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'} shadow-sm border-b`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className={`flex items-center transition-colors p-1 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <FontAwesomeIcon icon={faSprayCan} className={`text-xl sm:text-3xl flex-shrink-0 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`} />
              <div className="min-w-0 flex-1">
                <h1 className={`text-sm sm:text-lg md:text-xl font-bold truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{center.name}</h1>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="flex items-center">
                    {renderStars(center.rating)}
                  </div>
                  <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{center.rating} ({center.reviewCount || 0})</span>
                </div>
                {center.verified && (
                  <span className={`inline-block text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full mt-1 ${
                    theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-300'
                  }`}>
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'reviews', label: 'Reviews' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'border-red-500 text-red-500'
                    : theme === 'light'
                    ? 'border-transparent text-gray-600 hover:text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="relative z-10">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={true}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="h-48 sm:h-64 md:h-80"
        >
          <SwiperSlide>
            <div className="relative w-full h-48 sm:h-64 md:h-80">
              <img
                src={center.image || '/api/placeholder/800/400'}
                alt="Washing Center Banner"
                className="w-full h-48 sm:h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Mobile Information Card - Below Banner */}
        <div className="block sm:hidden p-3">
          <div className={`rounded-lg shadow-xl p-3 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-green-600 text-white w-4 h-4 rounded flex items-center justify-center">
                <StarIcon className="w-2.5 h-2.5" />
              </div>
              <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{center.rating}+ in Google</span>
            </div>

            <div className={`text-xs mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-3 h-3" />
                <span className="truncate">{center.address}</span>
              </div>
              {center.distance && (
                <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {center.distance} km away
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-green-600">Open Now</span>
              <div className="relative">
                <button
                  onClick={() => setShowTimeMenu(!showTimeMenu)}
                  className={`flex items-center space-x-1 hover:text-gray-900 text-xs ${theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                >
                  <span>{selectedTime}</span>
                  <ChevronDownIcon className="w-3 h-3" />
                </button>

                {showTimeMenu && (
                  <div className={`absolute top-full right-0 mt-1 border rounded-lg shadow-lg z-30 min-w-28 ${
                    theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'
                  }`}>
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setShowTimeMenu(false);
                        }}
                        className={`block w-full text-left px-3 py-1.5 text-xs ${
                          theme === 'light'
                            ? 'text-gray-700 hover:bg-gray-50'
                            : 'text-white hover:bg-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`border-t pt-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex space-x-1">
                <button
                  onClick={() => onBookNow(center)}
                  className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-1.5 px-2 rounded-lg font-medium text-xs flex items-center justify-center space-x-1"
                >
                  <CalendarDaysIcon className="w-3 h-3" />
                  <span>Book</span>
                </button>

                <a
                  href={`tel:${getSanitizedPhone()}`}
                  className={`flex-1 border py-1.5 px-2 rounded-lg font-medium text-xs flex items-center justify-center space-x-1 ${
                    theme === 'light'
                      ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <PhoneIcon className="w-3 h-3" />
                  <span>Call</span>
                </a>

                <button
                  onClick={handleDirectionClick}
                  className={`flex-1 border py-1.5 px-2 rounded-lg font-medium text-xs flex items-center justify-center space-x-1 ${
                    theme === 'light'
                      ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <MapPinIcon className="w-3 h-3" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Overlay Card */}
        <div className="hidden sm:block absolute bottom-4 left-4 right-4 lg:right-auto lg:w-96 z-20">
          <div className={`rounded-lg shadow-xl p-3 sm:p-4 border backdrop-blur-sm bg-opacity-95 ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
          }`}>
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="bg-green-600 text-white w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center">
                <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{center.rating}+ in Google</span>
            </div>

            <div className={`text-xs sm:text-sm mb-2 sm:mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{center.address}</span>
              </div>
              {center.distance && (
                <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {center.distance} km away
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-semibold text-green-600">Open Now</span>
              <div className="relative">
                <button
                  onClick={() => setShowTimeMenu(!showTimeMenu)}
                  className={`flex items-center space-x-1 hover:text-gray-900 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                >
                  <span>{selectedTime}</span>
                  <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {showTimeMenu && (
                  <div className={`absolute top-full right-0 mt-1 border rounded-lg shadow-lg z-30 min-w-28 sm:min-w-32 ${
                    theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'
                  }`}>
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setShowTimeMenu(false);
                        }}
                        className={`block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm ${
                          theme === 'light'
                            ? 'text-gray-700 hover:bg-gray-50'
                            : 'text-white hover:bg-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`border-t pt-2 sm:pt-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => onBookNow(center)}
                  className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center space-x-1"
                >
                  <CalendarDaysIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Book Now</span>
                </button>

                <a
                  href={`tel:${getSanitizedPhone()}`}
                  className={`flex-1 border py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center space-x-1 ${
                    theme === 'light'
                      ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Call</span>
                </a>

                <button
                  onClick={handleDirectionClick}
                  className={`flex-1 border py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center space-x-1 ${
                    theme === 'light'
                      ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      : 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Direction</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {selectedTab === 'about' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Hero Section */}
            <div className={`rounded-xl p-4 sm:p-6 md:p-8 border ${
              theme === 'light' 
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' 
                : 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700'
            }`}>
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faSprayCan} className="text-lg sm:text-xl md:text-2xl text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{center.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center">
                      {renderStars(center.rating)}
                      <span className={`ml-2 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>({center.reviewCount || 0} reviews)</span>
                    </div>
                    {center.verified && (
                      <span className={`text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                        theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-300'
                      }`}>
                        ✓ Verified Partner
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{center.description}</p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <FontAwesomeIcon icon={faStar} className="text-white text-sm sm:text-base" />
                  </div>
                  <h4 className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Premium Quality</h4>
                </div>
                <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Professional-grade equipment and eco-friendly products for superior results</p>
              </div>
              
              <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <FontAwesomeIcon icon={faClock} className="text-white text-sm sm:text-base" />
                  </div>
                  <h4 className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Quick Service</h4>
                </div>
                <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Express services available with same-day completion guarantee</p>
              </div>
              
              <div className={`rounded-lg p-4 sm:p-6 border sm:col-span-2 md:col-span-1 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <FontAwesomeIcon icon={faSprayCan} className="text-white text-sm sm:text-base" />
                  </div>
                  <h4 className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Expert Team</h4>
                </div>
                <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Certified professionals with 5+ years of experience in auto detailing</p>
              </div>
            </div>

            {/* Contact & Location Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <h4 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Contact Information</h4>
                
                <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <FontAwesomeIcon icon={faMapPin} className="text-red-500 w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold mb-1 text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Location</p>
                      <p className={`text-xs sm:text-sm mb-1 sm:mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{center.location}</p>
                      <p className={`text-xs sm:text-sm break-words ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{center.address}</p>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>{center.distance}km from your location</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <FontAwesomeIcon icon={faPhone} className="text-red-500 w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold mb-1 text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Phone</p>
                      <p className={`text-xs sm:text-sm break-all ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{center.phone}</p>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Available 24/7 for bookings</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <FontAwesomeIcon icon={faClock} className="text-red-500 w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold mb-1 text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Operating Hours</p>
                      <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{center.operatingHours}</p>
                      <p className="text-green-600 text-xs mt-1">● Currently Open</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h4 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Center Details</h4>
                
                <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                    <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Price Range</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPriceRangeColor(center.priceRange)} ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                    }`}>
                      {getPriceRangeLabel(center.priceRange)}
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Starting from ₹299 for basic wash to ₹2,999 for premium detailing packages</p>
                </div>
                
                <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="mb-3 sm:mb-4">
                    <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Vehicle Types Supported</span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {center.vehicleTypes.map((type, index) => (
                      <span key={index} className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm ${
                        theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                      }`}>
                        <FontAwesomeIcon icon={getVehicleIcon(type)} className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-red-500" />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 sm:p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="mb-3 sm:mb-4">
                    <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Specializations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                    <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>• Ceramic Coating</div>
                    <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>• Paint Protection</div>
                    <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>• Interior Detailing</div>
                    <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>• Engine Cleaning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'services' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Service Categories */}
            <div>
              <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Service Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {center.serviceTypes.map((type, index) => (
                  <div key={index} className={`rounded-xl p-3 sm:p-4 md:p-6 border transition-all cursor-pointer group ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-red-500'
                      : 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 hover:border-red-500'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{getServiceIcon(type)}</div>
                      <h4 className={`font-semibold text-xs sm:text-sm mb-1 sm:mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Professional {type.replace('-', ' ')} services</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Services */}
            <div>
              <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Available Services</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {center.services.map((service, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-4 sm:p-6 border transition-all cursor-pointer group ${
                      selectedService === index 
                        ? theme === 'light'
                          ? 'ring-2 ring-red-500 border-red-500 bg-red-50'
                          : 'ring-2 ring-red-500 border-red-500 bg-gradient-to-br from-red-900/20 to-gray-800'
                        : theme === 'light'
                        ? 'bg-white border-gray-200 hover:border-red-400'
                        : 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 hover:border-red-400 hover:from-gray-700'
                    }`}
                    onClick={() => setSelectedService(selectedService === index ? null : index)}
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg sm:text-2xl">{getServiceIcon(center.serviceTypes[0])}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={`font-bold text-sm sm:text-lg truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{service.name}</h4>
                          <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Professional service</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-red-600 font-bold text-lg sm:text-xl">{service.price}</p>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Starting price</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Duration</span>
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>45-60 mins</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Includes</span>
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Full exterior wash</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Guarantee</span>
                        <span className="text-green-600 text-xs sm:text-sm">100% satisfaction</span>
                      </div>
                    </div>
                    
                    <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon 
                            icon={selectedService === index ? faCheck : faTimes} 
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${selectedService === index ? 'text-green-600' : theme === 'light' ? 'text-gray-400' : 'text-gray-400'}`}
                          />
                          <span className={`text-xs sm:text-sm ${selectedService === index ? 'text-green-600' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {selectedService === index ? 'Selected' : 'Click to select'}
                          </span>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Packages */}
            <div>
              <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Premium Packages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className={`rounded-xl p-4 sm:p-6 border ${
                  theme === 'light' 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                    : 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600'
                }`}>
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-2xl">🧽</span>
                    </div>
                    <h4 className={`font-bold text-sm sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Basic Wash</h4>
                    <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Perfect for regular maintenance</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-2 sm:mr-3"></span>
                      Exterior wash & dry
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-2 sm:mr-3"></span>
                      Wheel cleaning
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-2 sm:mr-3"></span>
                      Tire shine
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-bold text-lg sm:text-2xl">₹299</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>30-45 minutes</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-800 to-red-700 rounded-xl p-4 sm:p-6 border border-red-500 relative">
                  <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-500 text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">Most Popular</span>
                  </div>
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-2xl">✨</span>
                    </div>
                    <h4 className="text-white font-bold text-sm sm:text-lg">Premium Detailing</h4>
                    <p className="text-white text-xs sm:text-sm">Complete interior & exterior care</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    <div className="flex items-center text-white text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-2 sm:mr-3"></span>
                      Full exterior detailing
                    </div>
                    <div className="flex items-center text-white text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-2 sm:mr-3"></span>
                      Interior vacuum & clean
                    </div>
                    <div className="flex items-center text-white text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-2 sm:mr-3"></span>
                      Leather conditioning
                    </div>
                    <div className="flex items-center text-white text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-2 sm:mr-3"></span>
                      Paint protection
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg sm:text-2xl">₹1,299</p>
                    <p className="text-white text-xs">2-3 hours</p>
                  </div>
                </div>

                <div className={`rounded-xl p-4 sm:p-6 border sm:col-span-2 md:col-span-1 ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                    : 'bg-gradient-to-br from-purple-800 to-purple-700 border-purple-500'
                }`}>
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-2xl">💎</span>
                    </div>
                    <h4 className={`font-bold text-sm sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Luxury Package</h4>
                    <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>Ultimate premium experience</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                      Ceramic coating
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                      Engine bay cleaning
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                      Paint correction
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                      Premium wax finish
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-600 font-bold text-lg sm:text-2xl">₹2,999</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>4-6 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Review Summary */}
            <div className={`rounded-xl p-4 sm:p-6 md:p-8 border ${
              theme === 'light'
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                : 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Customer Reviews</h3>
                  <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>What our customers say about us</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-center mb-1 sm:mb-2">
                    {renderStars(center.rating)}
                    <span className={`ml-2 font-bold text-lg sm:text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{center.rating}</span>
                  </div>
                  <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{center.reviewCount || 0} reviews</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">98%</div>
                  <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">4.8</div>
                  <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">2.5k+</div>
                  <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">95%</div>
                  <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Return Customers</div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div>
              <h4 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Recent Reviews</h4>
              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    name: "Rajesh Kumar",
                    rating: 5,
                    comment: "Excellent service! My car looks brand new after the premium detailing. The team was very professional and completed the work on time. Highly recommend!",
                    date: "2 days ago",
                    service: "Premium Detailing",
                    avatar: "RK"
                  },
                  {
                    name: "Priya Sharma",
                    rating: 4,
                    comment: "Good service, reasonable prices. Staff was friendly and professional. The ceramic coating service was exceptional. Will definitely come back.",
                    date: "1 week ago",
                    service: "Ceramic Coating",
                    avatar: "PS"
                  },
                  {
                    name: "Amit Patel",
                    rating: 5,
                    comment: "Best car wash in the area! Highly recommend their premium package. The attention to detail is amazing. My car has never looked this good.",
                    date: "2 weeks ago",
                    service: "Luxury Package",
                    avatar: "AP"
                  },
                  {
                    name: "Sneha Reddy",
                    rating: 5,
                    comment: "Outstanding service! The team went above and beyond to ensure my car was spotless. The interior detailing was particularly impressive. Worth every penny!",
                    date: "3 weeks ago",
                    service: "Interior Detailing",
                    avatar: "SR"
                  },
                  {
                    name: "Vikram Singh",
                    rating: 4,
                    comment: "Great experience overall. The express service was quick and efficient. The car looked great and the staff was courteous. Will book again soon.",
                    date: "1 month ago",
                    service: "Express Wash",
                    avatar: "VS"
                  }
                ].map((review, index) => (
                  <div key={index} className={`rounded-xl p-4 sm:p-6 border transition-all ${
                    theme === 'light'
                      ? 'bg-white border-gray-200 hover:border-red-500'
                      : 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 hover:border-red-500'
                  }`}>
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h5 className={`font-semibold text-sm sm:text-lg truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{review.name}</h5>
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>{review.date}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {review.service}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`leading-relaxed text-sm sm:text-base ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{review.comment}</p>
                    
                    <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <button className={`flex items-center space-x-1 transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-red-600' : 'text-gray-400 hover:text-red-400'}`}>
                            <FontAwesomeIcon icon={faStar} className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm">Helpful</span>
                          </button>
                          <button className={`transition-colors text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600 hover:text-red-600' : 'text-gray-400 hover:text-red-400'}`}>
                            Reply
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Verified Purchase</span>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Guidelines */}
            <div className={`rounded-xl p-4 sm:p-6 border ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30'
            }`}>
              <h4 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Review Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3"></span>
                    Reviews are verified after service completion
                  </div>
                  <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3"></span>
                    We encourage honest feedback
                  </div>
                  <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3"></span>
                    Photos are welcome in reviews
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                    We respond to all reviews within 24 hours
                  </div>
                  <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                    Your feedback helps us improve
                  </div>
                  <div className={`flex items-center text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                    Thank you for choosing our services
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WashingCenterDetail;