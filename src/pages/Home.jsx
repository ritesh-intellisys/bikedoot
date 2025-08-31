import React, { useState, useEffect } from 'react';
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
import GarageListing from '../components/homeComponents/GarageListing';
import Footer from '../components/Footer';
import { fetchLandingPageData } from '../services/landingpage';

const Home = ({ setCurrentPage }) => {
  // State management - exact from original site
  const [selectedCity, setSelectedCity] = useState(() => {
    return sessionStorage.getItem("selectedCity") || "Pune";
  });
  const [landingData, setLandingData] = useState({});
  const [cities, setCities] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filters, setFilters] = useState(null);
  const [locationReady, setLocationReady] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [garages, setGarages] = useState([]);
  const [showGarageListing, setShowGarageListing] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [showGarageDetail, setShowGarageDetail] = useState(false);

  // Geolocation setup - exact from original site
  useEffect(() => {
    const storedLat = sessionStorage.getItem("latitude");
    const storedLng = sessionStorage.getItem("longitude");

    if (storedLat && storedLng) {
      setLocationReady(true);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          sessionStorage.setItem("latitude", coords.latitude);
          sessionStorage.setItem("longitude", coords.longitude);
          setLocationReady(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Set fallback coordinates
          sessionStorage.setItem("latitude", "17.74162");
          sessionStorage.setItem("longitude", "73.8567");
          setLocationReady(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationReady(true);
    }
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

  // Handle service category click
  const handleServiceClick = (serviceType) => {
    if (serviceType === 'two-wheeler' || serviceType === 'four-wheeler' || serviceType === 'six-wheeler') {
      setShowGarageListing(true);
      setSelectedServiceId(1); // Garage service ID
    } else {
      // Show coming soon for other services
      alert(`${serviceType} service - Coming Soon!`);
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
    setSelectedServiceId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
      />

      {/* Main Content */}
      <main className="pt-16">
        {!showGarageListing ? (
          <>
            {/* Banner Carousel */}
            <BannerCarousel banners={landingData.banners || []} />

            {/* Service Categories */}
            <ServiceCategories onServiceClick={handleServiceClick} />

            {/* Marketing Section */}
            <section className="py-20 px-4 bg-gray-900">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                      Your Vehicle, <span className="text-pink-600">Our Priority</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                      Whether you drive a bike, car, or commercial vehicle, we connect you with the best garages in your area. 
                      Get transparent pricing, verified mechanics, and quality service for all vehicle types. 
                      From routine maintenance to major repairs, find the right garage for your needs.
                    </p>
                    <button className="bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                      EXPLORE SERVICES
                    </button>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Vehicle Service"
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
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Why Choose Our Platform
                  </h2>
                  <p className="text-xl text-gray-400">Trusted by vehicle owners across India</p>
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
                      <div className="text-4xl mb-4 text-pink-500">
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
                        <span className="text-pink-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Verified garage network for all vehicle types
                      </li>
                      <li className="flex items-center">
                        <span className="text-pink-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Transparent pricing with detailed cost breakdowns
                      </li>
                      <li className="flex items-center">
                        <span className="text-pink-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Real-time service tracking and updates
                      </li>
                      <li className="flex items-center">
                        <span className="text-pink-600 mr-3">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        Support for 2, 4, and 6 wheelers
                      </li>
                      <li className="flex items-center">
                        <span className="text-pink-600 mr-3">
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
            {/* Back Button */}
            <div className="py-4 px-4 bg-gray-900">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={backToMain}
                  className="flex items-center text-pink-500 hover:text-pink-400 transition-colors duration-200"
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            {/* Garage Listing */}
            <GarageListing
              selectedCity={selectedCity}
              filterData={filterData}
              onGarageClick={handleGarageClick}
            />
          </>
        )}
      </main>

      {/* Garage Detail Modal */}
      {showGarageDetail && selectedGarage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedGarage.name}</h2>
                <button
                  onClick={closeGarageDetail}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedGarage.image}
                    alt={selectedGarage.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.floor(selectedGarage.rating) ? "text-yellow-400" : "text-gray-600"}>
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-400">({selectedGarage.rating})</span>
                    {selectedGarage.verified && (
                      <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-4">{selectedGarage.description}</p>
                  
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Location:</strong> {selectedGarage.location}</p>
                    <p><strong>Address:</strong> {selectedGarage.address}</p>
                    <p><strong>Phone:</strong> {selectedGarage.phone}</p>
                    <p><strong>Hours:</strong> {selectedGarage.operatingHours}</p>
                    <p><strong>Distance:</strong> {selectedGarage.distance}km away</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Services:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedGarage.services.map((service) => (
                        <div key={service.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                          <span className="text-gray-300">{service.name}</span>
                          <span className="text-pink-500 font-semibold">{service.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />

    </div>
  );
};

export default Home;
