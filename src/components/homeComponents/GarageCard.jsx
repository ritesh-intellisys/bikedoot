import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { isAuthenticated } from '../../services/authService';
import { useTheme } from '../context/ThemeContext';

const GarageCard = ({ garage, onClick, isExpanded = false, setCurrentPage, onShowLoginPopup }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const handleBookNow = (e) => {
    e.stopPropagation(); // Prevent card click event
    console.log("Book Now clicked for garage:", garage.id, garage.name);
    
    // Check if user is authenticated
    if (isAuthenticated()) {
      console.log("✅ User is authenticated, navigating to booking with garageId:", garage.id);
      navigate("/booking", { 
        state: { garageId: garage.id } 
      });
    } else {
      console.log("❌ User not authenticated, showing login popup");
      if (onShowLoginPopup) {
        onShowLoginPopup(garage.id);
      }
    }
  };
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : theme === 'light' ? 'text-gray-300' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all cursor-pointer ${
        theme === 'light' 
          ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md' 
          : 'bg-gray-800 hover:bg-gray-700'
      } ${
        isExpanded ? 'ring-2 ring-red-500' : ''
      }`}
      onClick={() => onClick(garage)}
    >
      <div className="relative">
        <img
          src={garage.image}
          alt={garage.name}
          className="w-full h-48 object-cover"
        />
        {garage.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Verified
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {garage.distance}km away
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{garage.name}</h3>
          <div className="flex items-center">
            {renderStars(garage.rating)}
            <span className={`ml-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>({garage.rating})</span>
          </div>
        </div>
        
        <div className={`flex items-center text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{garage.location}</span>
        </div>
        
        <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{garage.address}</p>
        
        {isExpanded && (
          <div className={`border-t pt-3 mt-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            <div className={`flex items-center text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <PhoneIcon className="w-4 h-4 mr-1" />
              <span>{garage.phone}</span>
            </div>
            
            <div className={`flex items-center text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{garage.operatingHours}</span>
            </div>
            
            <div className="mb-3">
              <h4 className={`text-sm font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Services:</h4>
              <div className="flex flex-wrap gap-2">
                {garage.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {service.name} - {service.price}
                  </span>
                ))}
                {garage.services.length > 3 && (
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                    +{garage.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{garage.description}</p>
          </div>
        )}
        
                        <button 
          onClick={isExpanded ? handleBookNow : undefined}
          className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-3"
        >
          {isExpanded ? 'Book Now' : 'View Details'}
        </button>
        
        {/* Always show Book Now button for quick booking */}
        {!isExpanded && (
          <button 
            onClick={handleBookNow}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-2"
          >
            Book Now
          </button>
        )}
      </div>

    </div>
  );
};

export default GarageCard;
