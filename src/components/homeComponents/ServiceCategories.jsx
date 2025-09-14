import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMotorcycle, 
  faCar, 
  faTruck, 
  faExclamationTriangle,
  faTools,
  faShoppingCart,
  faKey,
  faBolt,
  faChevronDown,
  faChevronUp,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const ServiceCategories = forwardRef(({ onServiceClick }, ref) => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    openVehicleModal: () => setIsVehicleModalOpen(true)
  }));

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsVehicleModalOpen(false);
      }
    };

    if (isVehicleModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVehicleModalOpen]);

  const vehicleTypes = [
    {
      id: 1,
      title: "2 Wheeler",
      description: "Bikes, scooters, motorcycles",
      icon: faMotorcycle,
      type: 'two-wheeler'
    },
    {
      id: 2,
      title: "3 Wheeler",
      description: "Auto rickshaws, tuk-tuks",
      icon: faCar,
      type: 'three-wheeler'
    },
    {
      id: 3,
      title: "4 Wheeler",
      description: "Cars, SUVs, passenger vehicles",
      icon: faCar,
      type: 'four-wheeler'
    },
    {
      id: 4,
      title: "6 Wheeler",
      description: "Trucks, commercial vehicles",
      icon: faTruck,
      type: 'six-wheeler'
    }
  ];

  const serviceCategories = [
    {
      id: 1,
      title: "Garage",
      description: "Professional vehicle services",
      icon: faTools,
      available: true,
      type: 'garage',
      hasDropdown: true
    },
    {
      id: 2,
      title: "Buy/Sell",
      description: "Purchase or sell vehicles",
      icon: faShoppingCart,
      available: false,
      type: 'buy-sell'
    },
    {
      id: 3,
      title: "Rent",
      description: "Vehicle rental services",
      icon: faKey,
      available: false,
      type: 'rent'
    },
    {
      id: 4,
      title: "EV Service",
      description: "Electric vehicle services",
      icon: faBolt,
      available: false,
      type: 'ev-service'
    },
    {
      id: 5,
      title: "Emergency Services",
      description: "24/7 roadside assistance",
      icon: faExclamationTriangle,
      available: false,
      type: 'emergency'
    }
  ];

  const handleVehicleTypeClick = (vehicleType) => {
    onServiceClick(vehicleType.type);
    setIsVehicleModalOpen(false);
  };

  const handleCardClick = (service) => {
    if (service.hasDropdown) {
      setIsVehicleModalOpen(true);
    } else if (service.available) {
      onServiceClick(service.type);
    } else {
      alert(`${service.title} - Coming Soon!`);
    }
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsVehicleModalOpen(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div id="services-section" className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Services for All Vehicle Types
          </h2>
          <p className="text-lg text-gray-400">Find the right service for your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {serviceCategories.map((category) => (
            <div key={category.id} className="relative">
              <div
                className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick(category)}
              >
                <div className="text-4xl mb-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  <FontAwesomeIcon icon={category.icon} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{category.title}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                
                {category.hasDropdown ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SELECT VEHICLE</span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className="text-sm"
                      style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} 
                    />
                  </div>
                ) : category.available ? (
                  <button 
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    FIND GARAGES
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">Coming Soon</span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Type Selection Modal */}
      {isVehicleModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col relative">
            {/* Close Button */}
            <button
              onClick={() => setIsVehicleModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-red-200 transition-colors p-2 z-10"
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-red-500 group"
                    onClick={() => handleVehicleTypeClick(vehicle)}
                  >
                    <div className="text-6xl mb-4 transition-colors" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      <FontAwesomeIcon icon={vehicle.icon} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{vehicle.title}</h3>
                    <p className="text-gray-400 text-base">{vehicle.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-800 px-6 py-3 border-t border-gray-700 flex-shrink-0">
              <p className="text-center text-gray-400 text-xs">
                Click on any vehicle type to find verified garages near you
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

export default ServiceCategories;
