import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  StarIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  ChevronDownIcon,
  CalendarDaysIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { fetchGarageById } from '../../services/garageDetailService';
import { useTheme } from '../context/ThemeContext';

const GarageDetailPage = ({ garage, onClose, onBookNow }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('about');
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [garageData, setGarageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  // Fallback images for garage cover images
  const fallbackImages = [
    'https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/1200x1800-old/19250/SM909715.jpg?date=Thu%20Oct%2002%202025%2021:08:06%20GMT+0530%20(India%20Standard%20Time)',
    'https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/1200x1800-old/16979/SM738559.jpg?date=Thu%20Oct%2002%202025%2021:09:38%20GMT+0530%20(India%20Standard%20Time)',
    'https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/1200x1800-old/16979/SM738531.jpg?date=Thu%20Oct%2002%202025%2021:10:16%20GMT+0530%20(India%20Standard%20Time)',
    'https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/1200x1800-old/16979/SM738539.jpg?date=Thu%20Oct%2002%202025%2021:10:54%20GMT+0530%20(India%20Standard%20Time)'
  ];

  // Get fallback image based on garage ID
  const getFallbackImage = (garageId) => {
    if (!garageId) return fallbackImages[0];
    const index = (garageId - 1) % fallbackImages.length;
    return fallbackImages[index];
  };

  // Default fallback image for when all else fails
  const defaultFallbackImage = "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg";
  
  // Refs for smooth scrolling
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);

  // Fetch garage details from API
  useEffect(() => {
    const loadGarageDetails = async () => {
      if (!garage?.id) {
        setError('No garage ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchGarageById(garage.id);
        if (data) {
          console.log('🔍 Full Garage Data from API:', data);
          setGarageData(data);
        } else {
          setError('Failed to fetch garage details');
        }
      } catch (err) {
        console.error('Error fetching garage details:', err);
        setError('Failed to load garage details');
      } finally {
        setLoading(false);
      }
    };

    loadGarageDetails();
  }, [garage?.id]);

  // Use only real API data for operating hours
  const operatingHours = garageData?.operatingHours || [];

  // Mock time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  // Scroll to section when tab changes
  useEffect(() => {
    const scrollToSection = () => {
      const refMap = {
        about: aboutRef,
        services: servicesRef,
        reviews: reviewsRef,
      };

      const element = refMap[selectedTab]?.current;
      console.log('🔍 Scrolling to section:', selectedTab, 'Element:', element);
      
      if (element) {
        // Get the main scrollable container
        const mainContainer = document.querySelector('.min-h-screen.bg-white');
        
        if (mainContainer) {
          const containerRect = mainContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          
          // Calculate relative position within the container
          const relativeTop = elementRect.top - containerRect.top;
          const scrollTop = mainContainer.scrollTop + relativeTop - 100; // 100px offset for header
          
          console.log('🔍 Container scroll position:', scrollTop);
          
          mainContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        } else {
          // Fallback to window scroll
          const topOffset = 120;
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementTop - topOffset;
          
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      } else {
        console.warn('🔍 Element not found for tab:', selectedTab);
      }
    };

    // Add a small delay to ensure the element is rendered
    setTimeout(scrollToSection, 200);
  }, [selectedTab]);

  const handleDirectionClick = () => {
    // Prefer API data, then prop fallback
    const apiLoc = garageData?.location;
    const propLoc = garage?.location;
    const lat = apiLoc?.latitude || apiLoc?.lat || garageData?.latitude || propLoc?.latitude || propLoc?.lat || garage?.latitude;
    const lng = apiLoc?.longitude || apiLoc?.lng || garageData?.longitude || propLoc?.longitude || propLoc?.lng || garage?.longitude;
    if (lat && lng) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;
      window.open(mapsUrl, '_blank');
      return;
    }
    // Fallback: open by address if available
    const address = garageData?.address || garage?.address || '';
    if (address) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const getSanitizedPhone = () => {
    const rawPhone = garageData?.phone || garage?.phone;
    if (!rawPhone) return '';
    return String(rawPhone).replace(/[^+\d]/g, '');
  };

  const handleCallClick = () => {
    const sanitized = getSanitizedPhone();
    if (!sanitized || sanitized.replace(/\D/g, '').length === 0) return;
    // Open modal on laptop/desktop screens, dial directly on mobile
    if (window.innerWidth >= 1024) {
      setIsCallModalOpen(true);
    } else {
      window.location.href = `tel:${sanitized}`;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Loading garage details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Error Loading Garage</h2>
          <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{error}</p>
            <button
              onClick={onClose}
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-6 py-2 rounded-lg"
            >
            ←
            </button>
          </div>
      </div>
    );
  }

  // Use only API data - no fallback to passed garage data
  const displayGarage = garageData;

  // Show error if no garage data available
  if (!displayGarage) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Garage Not Found</h2>
          <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>This garage information is not available.</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-6 py-2 rounded-lg"
          >
            ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        {/* Header */}
        <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-800'} shadow-sm border-b`}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className={`flex items-center transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center space-x-4">
                <img
                  src={displayGarage?.image || getFallbackImage(displayGarage?.id)}
                  alt={displayGarage?.name || 'Garage'}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    if (e.target.src !== getFallbackImage(displayGarage?.id)) {
                      e.target.src = getFallbackImage(displayGarage?.id);
                    } else {
                      e.target.src = defaultFallbackImage;
                    }
                  }}
                />
                <div>
                  <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{displayGarage?.name}</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(displayGarage?.rating || 4.5) 
                              ? 'text-yellow-400 fill-current' 
                              : theme === 'light' ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{displayGarage?.rating || 4.5} ({displayGarage?.reviewCount || 0} reviews)</span>
                  </div>
                  {displayGarage?.verified && (
                    <span className="inline-block bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full mt-1">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex space-x-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'services', label: 'Services' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
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
            pagination={displayGarage?.banners && displayGarage.banners.length > 1 ? { clickable: true } : false}
            autoplay={displayGarage?.banners && displayGarage.banners.length > 1 ? { delay: 3000 } : false}
            loop={displayGarage?.banners && displayGarage.banners.length > 1}
            className="h-80"
          >
            {displayGarage?.banners && displayGarage.banners.length > 0 ? (
              displayGarage.banners.map((banner, index) => (
              <SwiperSlide key={index}>
                  <div className="relative w-full h-80">
                <img
                      src={banner.image || displayGarage?.image || getFallbackImage(displayGarage?.id)}
                  alt="Garage Banner"
                  className="w-full h-80 object-cover"
                      onError={(e) => {
                        if (e.target.src !== getFallbackImage(displayGarage?.id)) {
                          e.target.src = getFallbackImage(displayGarage?.id);
                        } else {
                          e.target.src = defaultFallbackImage;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>
              </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="relative w-full h-80">
                <img
                    src={displayGarage?.image || getFallbackImage(displayGarage?.id)}
                  alt="Garage Banner"
                  className="w-full h-80 object-cover"
                    onError={(e) => {
                      if (e.target.src !== getFallbackImage(displayGarage?.id)) {
                        e.target.src = getFallbackImage(displayGarage?.id);
                      } else {
                        e.target.src = defaultFallbackImage;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Mobile Information Card - Below Banner */}
          <div className="block sm:hidden p-4">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} rounded-lg shadow-xl p-4 border`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-green-600 text-white w-5 h-5 rounded flex items-center justify-center">
                  <StarIcon className="w-3 h-3" />
                </div>
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>4.5k+ in Google</span>
              </div>
              
              <div className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{displayGarage?.address}</span>
                </div>
                {displayGarage?.distance && (
                  <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {displayGarage.distance} km away
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-green-400">Open Now</span>
                <div className="relative">
                  <button
                    onClick={() => setShowTimeMenu(!showTimeMenu)}
                    className={`flex items-center space-x-1 ${theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                  >
                    <span>{selectedTime}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  
                  {showTimeMenu && (
                    <div className={`absolute top-full right-0 mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'} border rounded-lg shadow-lg z-30 min-w-32`}>
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setShowTimeMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-700 text-white'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`border-t pt-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <div className="flex space-x-2">
                  <button
                    onClick={onBookNow}
                    className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Book Now</span>
                  </button>
                  
                  <a
                    href={`tel:${getSanitizedPhone()}`}
                    className={`flex-1 border py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-100 text-gray-700' : 'border-gray-600 hover:bg-gray-700 text-gray-300'}`}
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  
                  <button
                    onClick={handleDirectionClick}
                    className={`flex-1 border py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-100 text-gray-700' : 'border-gray-600 hover:bg-gray-700 text-gray-300'}`}
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Direction</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Overlay Card */}
          <div className="hidden sm:block absolute bottom-4 left-4 right-4 lg:right-auto lg:w-96 z-20">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} rounded-lg shadow-xl p-4 border backdrop-blur-sm ${theme === 'light' ? 'bg-opacity-95' : 'bg-opacity-95'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-green-600 text-white w-5 h-5 rounded flex items-center justify-center">
                  <StarIcon className="w-3 h-3" />
                </div>
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>4.5k+ in Google</span>
              </div>
              
              <div className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{displayGarage?.address}</span>
                </div>
                {displayGarage?.distance && (
                  <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {displayGarage.distance} km away
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-green-400">Open Now</span>
                <div className="relative">
                  <button
                    onClick={() => setShowTimeMenu(!showTimeMenu)}
                    className={`flex items-center space-x-1 ${theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                  >
                    <span>{selectedTime}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  
                  {showTimeMenu && (
                    <div className={`absolute top-full right-0 mt-1 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'} border rounded-lg shadow-lg z-30 min-w-32`}>
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setShowTimeMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-700 text-white'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`border-t pt-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <div className="flex space-x-2">
                  <button
                    onClick={onBookNow}
                    className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Book Now</span>
                  </button>
                  
                  <a
                    href={`tel:${getSanitizedPhone()}`}
                    className={`flex-1 border py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-100 text-gray-700' : 'border-gray-600 hover:bg-gray-700 text-gray-300'}`}
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  
                  <button
                    onClick={handleDirectionClick}
                    className={`flex-1 border py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-100 text-gray-700' : 'border-gray-600 hover:bg-gray-700 text-gray-300'}`}
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Direction</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Desktop Call Modal */}
          {isCallModalOpen && (
            <div className="hidden lg:flex fixed inset-0 z-30 items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setIsCallModalOpen(false)}></div>
              <div className={`relative ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} border rounded-xl shadow-2xl p-6 w-80`}>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Call Garage</h3>
                <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Phone number</p>
                <div className={`${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'} px-3 py-2 rounded-md font-mono text-sm mb-4 select-all`}>
                  {getSanitizedPhone()}
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
                    onClick={() => {
                      const num = getSanitizedPhone();
                      if (num) {
                        window.location.href = `tel:${num}`;
                      }
                      setIsCallModalOpen(false);
                    }}
                  >
                    Call
                  </button>
                  <button
                    className={`flex-1 border py-2 rounded-lg font-medium ${theme === 'light' ? 'border-gray-300 hover:bg-gray-100 text-gray-700' : 'border-gray-600 hover:bg-gray-800 text-gray-200'}`}
                    onClick={() => setIsCallModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* About Section */}
          <div ref={aboutRef} className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>About</h2>
            <p className={`leading-relaxed mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              {displayGarage?.description || "Professional automotive service center providing comprehensive maintenance and repair services for all types of vehicles. Our experienced technicians ensure quality service and customer satisfaction."}
            </p>
            
            {displayGarage?.brands && displayGarage.brands.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Supported Brands</h3>
                <div className="flex flex-wrap gap-2">
                  {displayGarage.brands.map((brand, index) => (
                    <span
                      key={index}
                      className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {operatingHours && operatingHours.length > 0 && (
              <div className="mt-4">
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Operating Hours</h3>
                <div className="space-y-1">
                  {operatingHours.map((hours, index) => (
                    <div key={index} className={`flex justify-between ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <span>{hours.day}</span>
                      <span>{hours.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div ref={servicesRef} className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Services</h2>
            
            {/* Regular Services from API - Only show if data exists */}
            {displayGarage?.services?.service && displayGarage.services.service.length > 0 ? (
              displayGarage.services.service.map((serviceType, index) => {
              const [engineType] = Object.keys(serviceType);
              const serviceList = serviceType[engineType];

              return (
                <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold text-red-500 mb-3">{engineType}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceList?.map((item, idx) => (
                      <div
                        key={idx}
                          className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-lg p-3 flex items-center justify-between border`}
                      >
                          <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>{item.name}</span>
                          <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
              })
            ) : (
              <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                <p>No services available for this garage.</p>
              </div>
            )}

            {/* Add-on Services from API */}
            {displayGarage?.services?.addon && (
              <div className={`border-t pt-6 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Add-on Services</h3>
                {displayGarage.services.addon.map((serviceType, index) => {
                  const [engineType] = Object.keys(serviceType);
                  const serviceList = serviceType[engineType];

                  return (
                    <div key={index} className="mb-4">
                      <h4 className="text-md font-semibold text-red-500 mb-2">{engineType}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {serviceList?.map((item, idx) => (
                          <div
                            key={idx}
                            className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-lg p-3 flex items-center justify-between border`}
                          >
                            <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>{item.name}</span>
                            <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div ref={reviewsRef} className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} rounded-lg shadow-sm border p-6`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Reviews</h2>
            
            {displayGarage?.reviews?.length === 0 || !displayGarage?.reviews ? (
              <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>No reviews available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayGarage.reviews.map((review, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{review.name || 'Anonymous'}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < (review.rating || 5) 
                                ? 'text-yellow-400 fill-current' 
                                : theme === 'light' ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{review.comment || review.review}</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{review.date || 'Recently'}</p>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GarageDetailPage;
