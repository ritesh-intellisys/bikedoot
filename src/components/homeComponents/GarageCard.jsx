import React from 'react';
import { StarIcon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const GarageCard = ({ garage, onClick, isExpanded = false }) => {
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

  return (
    <div
      className={`bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all cursor-pointer ${
        isExpanded ? 'ring-2 ring-pink-500' : ''
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
          <h3 className="text-lg font-semibold text-white">{garage.name}</h3>
          <div className="flex items-center">
            {renderStars(garage.rating)}
            <span className="ml-1 text-sm text-gray-400">({garage.rating})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{garage.location}</span>
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{garage.address}</p>
        
        {isExpanded && (
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <PhoneIcon className="w-4 h-4 mr-1" />
              <span>{garage.phone}</span>
            </div>
            
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{garage.operatingHours}</span>
            </div>
            
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-white mb-2">Services:</h4>
              <div className="flex flex-wrap gap-2">
                {garage.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                  >
                    {service.name} - {service.price}
                  </span>
                ))}
                {garage.services.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{garage.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">{garage.description}</p>
          </div>
        )}
        
                        <button className="w-full bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-3">
          {isExpanded ? 'Book Now' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default GarageCard;
