import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMotorcycle, 
  faCar, 
  faTruck, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

const ServiceCategories = ({ onServiceClick }) => {
  const serviceCategories = [
    {
      id: 1,
      title: "2 Wheeler Services",
      description: "Bikes, scooters, and motorcycles",
      icon: faMotorcycle,
      available: true,
      type: 'two-wheeler'
    },
    {
      id: 2,
      title: "4 Wheeler Services",
      description: "Cars, SUVs, and passenger vehicles",
      icon: faCar,
      available: true,
      type: 'four-wheeler'
    },
    {
      id: 3,
      title: "6 Wheeler Services",
      description: "Trucks and commercial vehicles",
      icon: faTruck,
      available: true,
      type: 'six-wheeler'
    },
    {
      id: 4,
      title: "Emergency Services",
      description: "24/7 roadside assistance",
      icon: faExclamationTriangle,
      available: false,
      type: 'emergency'
    }
  ];

  const handleCardClick = (service) => {
    if (service.available) {
      onServiceClick(service.type);
    } else {
      // Show coming soon notification
      alert(`${service.title} - Coming Soon!`);
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Services for All Vehicle Types
          </h2>
          <p className="text-xl text-gray-400">Find the right garage for your vehicle</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => handleCardClick(category)}
            >
                              <div className="text-4xl mb-4 text-pink-500">
                <FontAwesomeIcon icon={category.icon} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{category.title}</h3>
              <p className="text-gray-400 mb-4">{category.description}</p>
              {category.available ? (
                <button className="bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  FIND GARAGES
                </button>
              ) : (
                <span className="text-gray-500 text-sm">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
