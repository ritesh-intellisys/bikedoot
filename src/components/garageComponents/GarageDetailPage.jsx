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

const GarageDetailPage = ({ garage, onClose, onBookNow }) => {
  const [selectedTab, setSelectedTab] = useState('about');
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [garageData, setGarageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Mock operating hours (fallback if not in API)
  const operatingHours = [
    { day: "Monday", time: "9:00 AM – 11:00 PM" },
    { day: "Tuesday", time: "10:00 AM – 10:00 PM" },
    { day: "Wednesday", time: "9:30 AM – 11:00 PM" },
    { day: "Thursday", time: "9:00 AM – 10:30 PM" },
    { day: "Friday", time: "9:00 AM – 11:00 PM" },
    { day: "Saturday", time: "10:00 AM – 11:30 PM" },
    { day: "Sunday", time: "Closed" },
  ];

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
    if (garage?.location?.latitude && garage?.location?.longitude) {
      const { latitude, longitude } = garage.location;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const handleCallClick = () => {
    const phone = garageData?.phone || garage?.phone;
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  // Use API data if available, fallback to passed garage data
  const displayGarage = garageData || garage;

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading garage details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Garage</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={displayGarage?.image || 'https://via.placeholder.com/60'}
                  alt={displayGarage?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{displayGarage?.name}</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(displayGarage?.rating || 4.5) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{displayGarage?.rating || 4.5} ({displayGarage?.reviewCount || 0} reviews)</span>
                  </div>
                  {displayGarage?.verified && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
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
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="h-80"
          >
            {displayGarage?.banners?.map((banner, index) => (
              <SwiperSlide key={index}>
                <img
                  src={banner.image || displayGarage?.image}
                  alt="Garage Banner"
                  className="w-full h-80 object-cover"
                />
              </SwiperSlide>
            )) || (
              <SwiperSlide>
                <img
                  src={displayGarage?.image || 'https://via.placeholder.com/800x320'}
                  alt="Garage Banner"
                  className="w-full h-80 object-cover"
                />
              </SwiperSlide>
            )}
          </Swiper>

          {/* Overlay Card */}
          <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-96">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-green-500 text-white w-5 h-5 rounded flex items-center justify-center">
                  <StarIcon className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium">4.5k+ in Google</span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{displayGarage?.address}</span>
                </div>
                {displayGarage?.distance && (
                  <div className="text-xs text-gray-500 mt-1">
                    {displayGarage.distance} km away
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-green-600">Open Now</span>
                <div className="relative">
                  <button
                    onClick={() => setShowTimeMenu(!showTimeMenu)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                  >
                    <span>{selectedTime}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  
                  {showTimeMenu && (
                    <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setShowTimeMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex space-x-2">
                  <button
                    onClick={onBookNow}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Book Now</span>
                  </button>
                  
                  <button
                    onClick={handleCallClick}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  
                  <button
                    onClick={handleDirectionClick}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Direction</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* About Section */}
          <div ref={aboutRef} className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {displayGarage?.description || "Professional automotive service center providing comprehensive maintenance and repair services for all types of vehicles. Our experienced technicians ensure quality service and customer satisfaction."}
            </p>
            
            {displayGarage?.brands && displayGarage.brands.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Supported Brands</h3>
                <div className="flex flex-wrap gap-2">
                  {displayGarage.brands.map((brand, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {displayGarage?.operatingHours && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Operating Hours</h3>
                <p className="text-gray-600">{displayGarage.operatingHours}</p>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div ref={servicesRef} className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Services</h2>
            
            {/* Regular Services from API */}
            {displayGarage?.services?.service?.map((serviceType, index) => {
              const [engineType] = Object.keys(serviceType);
              const serviceList = serviceType[engineType];

              return (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">{engineType}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceList?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-semibold text-gray-900">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }) || (
              <div className="text-gray-500 text-center py-8">
                <p>No services available at the moment.</p>
              </div>
            )}

            {/* Add-on Services from API */}
            {displayGarage?.services?.addon && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add-on Services</h3>
                {displayGarage.services.addon.map((serviceType, index) => {
                  const [engineType] = Object.keys(serviceType);
                  const serviceList = serviceType[engineType];

                  return (
                    <div key={index} className="mb-4">
                      <h4 className="text-md font-semibold text-blue-600 mb-2">{engineType}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {serviceList?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-100 rounded-lg p-3 flex items-center justify-between"
                          >
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-semibold text-gray-900">₹{item.price}</span>
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
          <div ref={reviewsRef} className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
            
            {displayGarage?.reviews?.length === 0 || !displayGarage?.reviews ? (
              <p className="text-gray-500">No reviews available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayGarage.reviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{review.name || 'Anonymous'}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < (review.rating || 5) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{review.comment || review.review}</p>
                    <p className="text-xs text-gray-500">{review.date || 'Recently'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageDetailPage;
