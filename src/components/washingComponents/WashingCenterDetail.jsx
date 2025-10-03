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

const WashingCenterDetail = ({ center, onClose, onBookNow }) => {
  const [selectedService, setSelectedService] = useState(null);

  if (!center) return null;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
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
    <div className="min-h-screen bg-black text-white">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center text-white hover:text-red-300 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Washing Centers
            </button>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSprayCan} className="text-3xl text-white mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-white">{center.name}</h1>
                <div className="flex items-center mt-1">
                  {renderStars(center.rating)}
                  <span className="ml-2 text-white text-sm">({center.rating})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Location & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapPin} className="text-red-500 w-5 h-5 mr-3" />
              <div>
                <p className="text-white font-semibold">{center.location}</p>
                <p className="text-gray-400 text-sm">{center.address}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-red-500 w-5 h-5 mr-3" />
              <div>
                <p className="text-white font-semibold">Contact</p>
                <p className="text-gray-400 text-sm">{center.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-red-500 w-5 h-5 mr-3" />
              <div>
                <p className="text-white font-semibold">Operating Hours</p>
                <p className="text-gray-400 text-sm">{center.operatingHours}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-white font-semibold mb-2">Distance</p>
              <p className="text-gray-400">{center.distance}km away</p>
            </div>
            
            <div>
              <p className="text-white font-semibold mb-2">Price Range</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceRangeColor(center.priceRange)} bg-gray-800`}>
                {getPriceRangeLabel(center.priceRange)}
              </span>
            </div>
            
            <div>
              <p className="text-white font-semibold mb-2">Vehicle Types</p>
              <div className="flex flex-wrap gap-2">
                {center.vehicleTypes.map((type, index) => (
                  <span key={index} className="flex items-center bg-gray-800 px-3 py-1 rounded-full text-sm">
                    <FontAwesomeIcon icon={getVehicleIcon(type)} className="w-4 h-4 mr-1 text-red-500" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">About This Center</h3>
          <p className="text-gray-300">{center.description}</p>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {center.services.map((service, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedService === index ? 'ring-2 ring-red-500 bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedService(selectedService === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getServiceIcon(center.serviceTypes[0])}</span>
                    <div>
                      <h4 className="text-white font-semibold">{service.name}</h4>
                      <p className="text-red-400 font-bold">{service.price}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon 
                    icon={selectedService === index ? faCheck : faTimes} 
                    className={`w-5 h-5 ${selectedService === index ? 'text-green-400' : 'text-gray-400'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Types */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Service Categories</h3>
          <div className="flex flex-wrap gap-2">
            {center.serviceTypes.map((type, index) => (
              <span key={index} className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300">
                {getServiceIcon(type)} {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {[
              {
                name: "Rajesh Kumar",
                rating: 5,
                comment: "Excellent service! My car looks brand new after the premium detailing.",
                date: "2 days ago"
              },
              {
                name: "Priya Sharma",
                rating: 4,
                comment: "Good quality service at reasonable prices. Staff is professional.",
                date: "1 week ago"
              },
              {
                name: "Amit Patel",
                rating: 5,
                comment: "Best car wash in the area. Highly recommended for regular maintenance.",
                date: "2 weeks ago"
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-white font-semibold">{review.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{review.date}</span>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">What's Included</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Professional equipment
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Eco-friendly products
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Quality guarantee
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Free inspection
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Special Offers</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  10% off first visit
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Loyalty program
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Group discounts
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400 mr-2" />
                  Monthly packages
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onBookNow(center)}
            className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book Now
          </button>
          <button
            onClick={() => {
              // Simple contact action
              alert(`Contact ${center.name}\nPhone: ${center.phone}\nAddress: ${center.address}`);
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Contact Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default WashingCenterDetail;