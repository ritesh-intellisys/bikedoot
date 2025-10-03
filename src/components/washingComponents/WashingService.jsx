import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, MapPinIcon, StarIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSprayCan, faCar, faMotorcycle, faTruck, faStar } from '@fortawesome/free-solid-svg-icons';
import WashingCenterDetail from './WashingCenterDetail';

// Independent Washing & Detailing Service Component
// Uses only mock data - no API calls or redirects to garage sections
const WashingService = ({ selectedCity, onBackToMain, onWashingCenterClick, onShowLoginPopup }) => {
  const [washingCenters, setWashingCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [serviceType, setServiceType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showCenterDetail, setShowCenterDetail] = useState(false);

  // Mock washing and detailing centers data
  const mockWashingCenters = [
    {
      id: 1,
      name: "AutoSpa Premium Detailing",
      location: "Koregaon Park",
      address: "123, ABC Complex, Koregaon Park, Pune",
      phone: "+91 98765 43210",
      rating: 4.8,
      distance: 1.2,
      operatingHours: "8:00 AM - 8:00 PM",
      image: "https://plus.unsplash.com/premium_photo-1661443456250-5cd06d09701c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Basic Car Wash", price: "₹299" },
        { name: "Premium Detailing", price: "₹1,299" },
        { name: "Interior Cleaning", price: "₹599" },
        { name: "Paint Protection", price: "₹2,999" }
      ],
      vehicleTypes: ['car', 'bike'],
      serviceTypes: ['basic-wash', 'premium-detailing', 'interior'],
      priceRange: 'premium',
      description: "Premium car wash and detailing services with eco-friendly products"
    },
    {
      id: 2,
      name: "QuickWash Express",
      location: "Hinjewadi",
      address: "456, Tech Park, Hinjewadi, Pune",
      phone: "+91 98765 43211",
      rating: 4.5,
      distance: 2.1,
      operatingHours: "7:00 AM - 9:00 PM",
      image: "https://plus.unsplash.com/premium_photo-1661443444726-38e00b169bb2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Express Wash", price: "₹199" },
        { name: "Vacuum Cleaning", price: "₹99" },
        { name: "Tire Shine", price: "₹149" }
      ],
      vehicleTypes: ['car', 'bike'],
      serviceTypes: ['basic-wash', 'express'],
      priceRange: 'budget',
      description: "Quick and efficient car wash services for busy professionals"
    },
    {
      id: 3,
      name: "Elite Detailing Studio",
      location: "Baner",
      address: "789, Business Hub, Baner, Pune",
      phone: "+91 98765 43212",
      rating: 4.9,
      distance: 3.5,
      operatingHours: "9:00 AM - 7:00 PM",
      image: "https://images.unsplash.com/photo-1652454449601-e83b62eabe94?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Ceramic Coating", price: "₹4,999" },
        { name: "Paint Correction", price: "₹3,999" },
        { name: "Leather Treatment", price: "₹1,999" },
        { name: "Engine Bay Cleaning", price: "₹799" }
      ],
      vehicleTypes: ['car'],
      serviceTypes: ['premium-detailing', 'ceramic-coating'],
      priceRange: 'premium',
      description: "Luxury car detailing with professional-grade equipment"
    },
    {
      id: 4,
      name: "BikeWash Pro",
      location: "Wakad",
      address: "321, Service Center, Wakad, Pune",
      phone: "+91 98765 43213",
      rating: 4.6,
      distance: 1.8,
      operatingHours: "8:00 AM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1632823469901-5d2cfff5ba50?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Bike Wash", price: "₹149" },
        { name: "Chain Cleaning", price: "₹199" },
        { name: "Polish & Wax", price: "₹299" },
        { name: "Seat Cleaning", price: "₹199" }
      ],
      vehicleTypes: ['bike'],
      serviceTypes: ['basic-wash', 'bike-specific'],
      priceRange: 'budget',
      description: "Specialized bike washing and maintenance services"
    },
    {
      id: 5,
      name: "GreenWash Eco Center",
      location: "Kothrud",
      address: "654, Green Plaza, Kothrud, Pune",
      phone: "+91 98765 43214",
      rating: 4.7,
      distance: 4.2,
      operatingHours: "7:00 AM - 9:00 PM",
      image: "https://images.pexels.com/photos/4870699/pexels-photo-4870699.jpeg",
      services: [
        { name: "Eco Car Wash", price: "₹399" },
        { name: "Waterless Wash", price: "₹599" },
        { name: "Biodegradable Polish", price: "₹799" }
      ],
      vehicleTypes: ['car', 'bike'],
      serviceTypes: ['eco-friendly', 'basic-wash'],
      priceRange: 'mid-range',
      description: "Environmentally friendly car wash using recycled water"
    },
    {
      id: 6,
      name: "Luxury Auto Spa",
      location: "Koregaon Park",
      address: "987, Luxury Mall, Koregaon Park, Pune",
      phone: "+91 98765 43215",
      rating: 4.9,
      distance: 1.5,
      operatingHours: "10:00 AM - 8:00 PM",
      image: "https://images.pexels.com/photos/4870707/pexels-photo-4870707.jpeg",
      services: [
        { name: "Full Detailing", price: "₹2,999" },
        { name: "Paint Protection Film", price: "₹8,999" },
        { name: "Leather Conditioning", price: "₹1,499" },
        { name: "Engine Detailing", price: "₹1,299" }
      ],
      vehicleTypes: ['car'],
      serviceTypes: ['premium-detailing', 'luxury'],
      priceRange: 'premium',
      description: "High-end luxury car detailing and protection services"
    }
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

  // Initialize washing centers
  useEffect(() => {
    setWashingCenters(mockWashingCenters);
    setFilteredCenters(mockWashingCenters);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...washingCenters];

    // Service type filter
    if (serviceType !== 'all') {
      filtered = filtered.filter(center => 
        center.serviceTypes.includes(serviceType)
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(center => 
        center.priceRange === priceRange
      );
    }

    // Rating filter
    if (rating !== 'all') {
      const minRating = parseFloat(rating);
      filtered = filtered.filter(center => 
        center.rating >= minRating
      );
    }

    // Sort by
    if (sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredCenters(filtered);
  }, [washingCenters, serviceType, priceRange, rating, sortBy]);

  const handleWashingCenterClick = (center) => {
    setSelectedCenter(center);
    setShowCenterDetail(true);
  };

  const handleBookNow = (e, center) => {
    e.stopPropagation();
    console.log("Book Now clicked for washing center:", center.id, center.name);
    
    // Show a simple booking message for now
    // This keeps the washing service completely independent
    alert(`Booking ${center.name}\n\nServices Available:\n${center.services.map(s => `${s.name} - ${s.price}`).join('\n')}\n\nContact: ${center.phone}`);
  };

  const handleCloseDetail = () => {
    setShowCenterDetail(false);
    setSelectedCenter(null);
  };

  const handleBookNowFromDetail = (center) => {
    // Show a simple booking message for now
    // This keeps the washing service completely independent
    alert(`Booking ${center.name}\n\nServices Available:\n${center.services.map(s => `${s.name} - ${s.price}`).join('\n')}\n\nContact: ${center.phone}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#ff3864', borderTopColor: '#cc1e3a' }}></div>
            <p className="text-gray-400 mt-4">Loading washing centers...</p>
          </div>
        </div>
      </div>
    );
  }

  // If showing center detail, render the detail page
  if (showCenterDetail && selectedCenter) {
    return (
      <WashingCenterDetail
        center={selectedCenter}
        onClose={handleCloseDetail}
        onBookNow={handleBookNowFromDetail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Back Button */}
      <div className="bg-gray-900 border-b border-gray-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToMain}
            className="flex items-center text-white hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </button>
          <h1 className="text-xl font-bold text-white">
            <FontAwesomeIcon icon={faSprayCan} className="mr-2" />
            Washing & Detailing
          </h1>
        </div>
      </div>

      {/* Washing Centers Section */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Washing & Detailing Centers Near You
            </h2>
            <p className="text-lg text-gray-400">Find professional car wash and detailing services</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                  {/* Service Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Service Type</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Services</option>
                      <option value="basic-wash">Basic Wash</option>
                      <option value="premium-detailing">Premium Detailing</option>
                      <option value="ceramic-coating">Ceramic Coating</option>
                      <option value="eco-friendly">Eco-Friendly</option>
                      <option value="bike-specific">Bike Specific</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Prices</option>
                      <option value="budget">Budget (₹99-₹299)</option>
                      <option value="mid-range">Mid-Range (₹300-₹799)</option>
                      <option value="premium">Premium (₹800+)</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Minimum Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="distance">Distance</option>
                      <option value="rating">Rating</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Washing Centers Grid */}
            <div className="lg:col-span-3">
              {filteredCenters.length === 0 ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faSprayCan} className="text-6xl text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">No washing centers found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setServiceType('all');
                      setPriceRange('all');
                      setRating('all');
                    }}
                    className="mt-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCenters.map((center) => (
                    <div
                      key={center.id}
                      onClick={() => handleWashingCenterClick(center)}
                      className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105"
                    >
                      {/* Center Image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={center.image}
                          alt={center.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
                          {center.distance}km
                        </div>
                        <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {center.priceRange.charAt(0).toUpperCase() + center.priceRange.slice(1)}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{center.name}</h3>
                          <div className="flex items-center">
                            {renderStars(center.rating)}
                            <span className="ml-1 text-sm text-gray-400">({center.rating})</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span>{center.location}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">{center.address}</p>
                        
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>{center.operatingHours}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          <span>{center.phone}</span>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-white mb-2">Services:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.services.slice(0, 2).map((service, index) => (
                              <span
                                key={index}
                                className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                              >
                                {service.name} - {service.price}
                              </span>
                            ))}
                            {center.services.length > 2 && (
                              <span className="text-gray-500 text-xs">
                                +{center.services.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4">{center.description}</p>
                        
                        <div className="flex items-center justify-end">
                          <button 
                            onClick={(e) => handleBookNow(e, center)}
                            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WashingService;
