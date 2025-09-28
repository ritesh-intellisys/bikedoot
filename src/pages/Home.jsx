import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faCheck, 
  faShieldAlt, 
  faClock, 
  faDollarSign, 
  faMobileAlt, 
  faUsers,
  faCar
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/homeComponents/Header';
import BannerCarousel from '../components/homeComponents/BannerCarousel';
import ServiceCategories from '../components/homeComponents/ServiceCategories';
import TwoWheelerGarages from '../components/garageComponents/TwoWheelerGarages';
import ThreeWheelerGarages from '../components/garageComponents/ThreeWheelerGarages';
import FourWheelerGarages from '../components/garageComponents/FourWheelerGarages';
import SixWheelerGarages from '../components/garageComponents/SixWheelerGarages';
import GarageDetailPage from '../components/garageComponents/GarageDetailPage';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { fetchLandingPageData } from '../services/landingpage';
import { cleanupLocationData, getCurrentLocation, getCityFromCoordinates, storeLocationData } from '../utils/geolocation';
import LoginPopup from '../components/homeComponents/LoginPopup';

const Home = ({ setCurrentPage }) => {
  // State management - exact from original site
  const [selectedCity, setSelectedCity] = useState(() => {
    const city = sessionStorage.getItem("selectedCity") || "Pune";
    // Convert localities to main cities
    if (city === "Mulshi" || city === "Hinjewadi" || city === "Wakad" || city === "Baner") {
      sessionStorage.setItem("selectedCity", "Pune");
      return "Pune";
    }
    return city;
  });
  const [landingData, setLandingData] = useState({});
  const [cities, setCities] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filters, setFilters] = useState(null);
  const [locationReady, setLocationReady] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [garages, setGarages] = useState([]);
  const [showGarageListing, setShowGarageListing] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [showGarageDetail, setShowGarageDetail] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginPopupGarageId, setLoginPopupGarageId] = useState(null);

  // Ref for ServiceCategories component to access its modal functions
  const serviceCategoriesRef = useRef(null);

  // Handle URL parameters for returning from booking flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleType = urlParams.get('vehicleType');
    if (vehicleType) {
      console.log('📍 Returning from booking flow, showing garage list for:', vehicleType);
      setSelectedVehicleType(vehicleType);
      setShowGarageListing(true);
      setSelectedServiceId(1);
    }
  }, []);

  // Geolocation setup - improved with better error handling and city detection
  useEffect(() => {
    // Clean up any incorrect location data first
    cleanupLocationData();
    
    // Check if we already have location data
    if (sessionStorage.getItem("latitude") && sessionStorage.getItem("longitude")) {
      console.log("📍 Using existing location data");
      setLocationReady(true);
      return;
    }

    // Enhanced geolocation with better error handling
    const initializeLocation = async () => {
      setIsDetectingLocation(true);
      try {
        console.log("📍 Attempting to get current location...");
        const { latitude, longitude } = await getCurrentLocation();
        
        console.log("📍 Coordinates obtained:", { latitude, longitude });
        
        // Get city information from coordinates
        try {
          const cityData = await getCityFromCoordinates(latitude, longitude);
          console.log("📍 City data:", cityData);
          
          // Store location data with city information
          storeLocationData(latitude, longitude, cityData);
          
          // Update selected city if we got a valid city
          if (cityData.city) {
            setSelectedCity(cityData.city);
            console.log("📍 Updated selected city to:", cityData.city);
          }
        } catch (cityError) {
          console.warn("📍 Failed to get city data, using coordinates only:", cityError);
          // Store just coordinates if city detection fails
          sessionStorage.setItem("latitude", latitude.toString());
          sessionStorage.setItem("longitude", longitude.toString());
        }
        
        setLocationReady(true);
      } catch (error) {
        console.error("📍 Geolocation failed:", error);
        
        // Set fallback coordinates (Pune)
        const fallbackLat = 18.5204;
        const fallbackLng = 73.8567;
        sessionStorage.setItem("latitude", fallbackLat.toString());
        sessionStorage.setItem("longitude", fallbackLng.toString());
        sessionStorage.setItem("selectedCity", "Pune");
        
        console.log("📍 Using fallback location: Pune");
        setLocationReady(true);
      } finally {
        setIsDetectingLocation(false);
      }
    };

    initializeLocation();
  }, []);

  // Load landing page data - exact from original site
  useEffect(() => {
    const loadLandingPage = async (city) => {
      try {
        const data = await fetchLandingPageData(city.toLowerCase());
        setLandingData(data);
        setCities(data?.cities || []);
        setFilterData(data?.filter || {});
      } catch (err) {
        console.error("Failed to load landing page data:", err);
      }
    };

    const cityToLoad = selectedCity || sessionStorage.getItem("selectedCity") || "Pune";
    loadLandingPage(cityToLoad);
  }, [selectedCity]);

  // Session storage management - exact from original site
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "selectedCity") {
        setSelectedCity(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const cityFromStorage = sessionStorage.getItem("selectedCity");
      if (cityFromStorage !== selectedCity) {
        setSelectedCity(cityFromStorage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [selectedCity]);

  // Scroll to top when vehicle type changes (garage page opens)
  useEffect(() => {
    if (selectedVehicleType) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedVehicleType]);

  // Handle service category click
  const handleServiceClick = (serviceType) => {
    if (serviceType === 'two-wheeler' || serviceType === 'three-wheeler' || serviceType === 'four-wheeler' || serviceType === 'six-wheeler') {
      setShowGarageListing(true);
      setSelectedVehicleType(serviceType);
      setSelectedServiceId(1); // Garage service ID
    } else {
      // Show coming soon for other services
      alert(`${serviceType} service - Coming Soon!`);
    }
  };

  // Handle vehicle type change from garage pages
  const handleVehicleTypeChange = (vehicleType) => {
    setSelectedVehicleType(vehicleType);
  };

  // Handle opening vehicle type modal from BannerCarousel
  const handleFindGaragesClick = () => {
    if (serviceCategoriesRef.current) {
      serviceCategoriesRef.current.openVehicleModal();
    }
  };

  // Handle garage click
  const handleGarageClick = (garage) => {
    setSelectedGarage(garage);
    setShowGarageDetail(true);
  };

  // Handle filter apply
  const handleFilterApply = (newFilters) => {
    console.log("Filters received from child:", newFilters);
    setFilters(newFilters);
  };

  // Close garage detail modal
  const closeGarageDetail = () => {
    setShowGarageDetail(false);
    setSelectedGarage(null);
  };

  // Back to main page
  const backToMain = () => {
    setShowGarageListing(false);
    setSelectedVehicleType(null);
    setSelectedServiceId(null);
    // Scroll to top when going back to main page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle login popup from garage cards
  const handleShowLoginPopup = (garageId) => {
    console.log("🔍 Showing login popup for garage:", garageId);
    setLoginPopupGarageId(garageId);
    setShowLoginPopup(true);
  };

  // Handle login success for garage detail
  const handleLoginSuccess = () => {
    console.log("✅ Login successful, proceeding to booking");
    if (loginPopupGarageId) {
      // Login popup from garage card
      window.location.href = `/booking?garageId=${loginPopupGarageId}&returnTo=garage-list&vehicleType=${selectedVehicleType}`;
    } else {
      // Login popup from garage detail
      closeGarageDetail();
      window.location.href = `/booking?garageId=${selectedGarage.id}&returnTo=garage-list&vehicleType=${selectedVehicleType}`;
    }
    setShowLoginPopup(false);
    setLoginPopupGarageId(null);
  };

  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
        setCurrentPage={setCurrentPage}
        scrollToTop={scrollToTop}
        onBackToMain={backToMain}
        isDetectingLocation={isDetectingLocation}
      />


      {/* Main Content */}
      <main>
        {!showGarageListing ? (
          <>
            {/* Banner Carousel */}
            <BannerCarousel 
              banners={landingData.banners || []} 
              onFindGaragesClick={handleFindGaragesClick}
            />

            {/* Service Categories */}
            <ServiceCategories 
              ref={serviceCategoriesRef}
              onServiceClick={handleServiceClick} 
            />

            {/* Marketing Section */}
            <section className="py-20 px-4 bg-gray-900">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                      Your Vehicle, <span className="text-red-600">Our Priority</span>
                    </h2>
                    <p className="text-lg text-gray-300 mb-8">
                      Whether you drive a bike, car, or commercial vehicle, we connect you with the best garages in your area. 
                      Get transparent pricing, verified mechanics, and quality service for all vehicle types. 
                      From routine maintenance to major repairs, find the right garage for your needs.
                    </p>
                    <button 
                      onClick={() => {
                        const element = document.getElementById('services-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      EXPLORE SERVICES
                    </button>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg"
                      alt="Professional Garage Service"
                      className="rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Why Book With Us */}
            <section className="py-20 px-4 bg-black">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    Why Choose Our Platform
                  </h2>
                  <p className="text-lg text-gray-400">Trusted by vehicle owners across India</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {[
                    {
                      title: "Verified Garages",
                      description: "All garages are verified and quality-checked",
                      icon: faShieldAlt
                    },
                    {
                      title: "Transparent Pricing",
                      description: "No hidden costs, clear service breakdowns",
                      icon: faDollarSign
                    },
                    {
                      title: "All Vehicle Types",
                      description: "2 wheelers, 4 wheelers, and commercial vehicles",
                      icon: faCar
                    },
                    {
                      title: "Real-time Updates",
                      description: "Track your service progress live",
                      icon: faClock
                    },
                    {
                      title: "Customer Reviews",
                      description: "Read genuine reviews from other customers",
                      icon: faStar
                    },
                    {
                      title: "24/7 Support",
                      description: "Round-the-clock customer assistance",
                      icon: faMobileAlt
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        <FontAwesomeIcon icon={benefit.icon} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                {/* Customer Reviews */}
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-4 text-white">What Our Customers Say</h3>
                  <p className="text-xl text-gray-400">Real reviews from real customers</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Rahul Sharma",
                      location: "Mumbai",
                      rating: 5,
                      comment: "Found a great garage for my bike service. Transparent pricing and quality work.",
                      verified: true,
                      timestamp: "2 days ago"
                    },
                    {
                      name: "Priya Patel",
                      location: "Delhi",
                      rating: 5,
                      comment: "Excellent service for my car. The garage was professional and completed work on time.",
                      verified: true,
                      timestamp: "1 week ago"
                    },
                    {
                      name: "Amit Kumar",
                      location: "Bangalore",
                      rating: 4,
                      comment: "Good platform for comparing garage prices. Saved money on my truck service.",
                      verified: false,
                      timestamp: "2 weeks ago"
                    }
                  ].map((review, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-600"}>
                              <FontAwesomeIcon icon={faStar} />
                            </span>
                          ))}
                          {review.verified && (
                            <span className="ml-2 text-green-500 text-sm">
                              <FontAwesomeIcon icon={faCheck} className="mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 text-sm">{review.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mb-4">"{review.comment}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{review.name}</p>
                          <p className="text-gray-400 text-sm">{review.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Information Section */}
            <section className="py-20 px-4 bg-gray-800">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
                    <p className="text-gray-300 mb-4">
                      We're revolutionizing how vehicle owners find and connect with garages. Whether you own a bike, 
                      car, or commercial vehicle, our platform makes it easy to find verified garages near you with 
                      transparent pricing and quality service.
                    </p>
                    <p className="text-gray-300 mb-4">
                      Our comprehensive verification system ensures every garage meets high standards for quality, 
                      reliability, and customer service. We understand that your vehicle is essential for your daily 
                      life and business, so we connect you with the best mechanics in your area.
                    </p>
                    <p className="text-gray-300">
                      From routine maintenance and repairs to specialized services for all vehicle types, 
                      our platform offers a complete solution for all your vehicle care needs. Transparent 
                      pricing, real-time updates, and customer-first approach make us the trusted choice 
                      for vehicle owners across India.
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4 text-white">Platform Features</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <span className="text-red-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Verified garage network for all vehicle types
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Transparent pricing with detailed cost breakdowns
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Real-time service tracking and updates
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Support for 2, 4, and 6 wheelers
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        24/7 customer support and assistance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Render specific vehicle type garage component */}
            {selectedVehicleType === 'two-wheeler' && (
              <TwoWheelerGarages
                selectedCity={selectedCity}
                filterData={filterData}
                onGarageClick={handleGarageClick}
                onBackToMain={backToMain}
                onVehicleTypeChange={handleVehicleTypeChange}
                onShowLoginPopup={handleShowLoginPopup}
              />
            )}
            {selectedVehicleType === 'three-wheeler' && (
              <ThreeWheelerGarages
                selectedCity={selectedCity}
                filterData={filterData}
                onGarageClick={handleGarageClick}
                onBackToMain={backToMain}
                onVehicleTypeChange={handleVehicleTypeChange}
                onShowLoginPopup={handleShowLoginPopup}
              />
            )}
            {selectedVehicleType === 'four-wheeler' && (
              <FourWheelerGarages
                selectedCity={selectedCity}
                filterData={filterData}
                onGarageClick={handleGarageClick}
                onBackToMain={backToMain}
                onVehicleTypeChange={handleVehicleTypeChange}
                onShowLoginPopup={handleShowLoginPopup}
              />
            )}
            {selectedVehicleType === 'six-wheeler' && (
              <SixWheelerGarages
              selectedCity={selectedCity}
              filterData={filterData}
              onGarageClick={handleGarageClick}
              onBackToMain={backToMain}
              onVehicleTypeChange={handleVehicleTypeChange}
              onShowLoginPopup={handleShowLoginPopup}
            />
            )}
          </>
        )}
      </main>

      {/* Garage Detail Page */}
      {showGarageDetail && selectedGarage && (
        <GarageDetailPage
          garage={selectedGarage}
          onClose={closeGarageDetail}
          onBookNow={() => {
            // Check if user is authenticated
            const token = localStorage.getItem('authToken');
            
            if (token) {
              // User is authenticated, proceed to booking
              console.log("✅ User is authenticated, proceeding to booking");
              closeGarageDetail();
              window.location.href = `/booking?garageId=${selectedGarage.id}&returnTo=garage-list&vehicleType=${selectedVehicleType}`;
            } else {
              // User not authenticated, show login popup
              console.log("❌ User not authenticated, showing login popup");
              setShowLoginPopup(true);
            }
          }}
        />
      )}



      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} scrollToTop={scrollToTop} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home;
