import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSprayCan, faCar, faMotorcycle, faTruck, faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

const WashingSelectServiceStep = ({ 
  washingCenterInfo, 
  selectedService, 
  setSelectedService, 
  errors, 
  setErrors 
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  // Mock washing services data
  const mockWashingServices = [
    {
      id: 1,
      name: "Basic Car Wash",
      description: "Exterior wash, tire cleaning, and basic interior vacuum",
      price: 299,
      duration: "30-45 mins",
      category: "basic-wash",
      vehicleTypes: ['car', 'bike'],
      features: ["Exterior wash", "Tire cleaning", "Basic vacuum", "Dashboard cleaning"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Premium Detailing",
      description: "Complete interior and exterior detailing with waxing",
      price: 1299,
      duration: "2-3 hours",
      category: "premium-detailing",
      vehicleTypes: ['car'],
      features: ["Full exterior wash", "Waxing", "Interior deep clean", "Leather conditioning", "Tire shine"],
      image: "https://images.unsplash.com/photo-1632823469901-5d2cfff5ba50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Interior Deep Clean",
      description: "Comprehensive interior cleaning and sanitization",
      price: 599,
      duration: "1-2 hours",
      category: "interior",
      vehicleTypes: ['car', 'bike'],
      features: ["Seat cleaning", "Carpet shampooing", "Dashboard detailing", "Air vent cleaning"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      name: "Paint Protection",
      description: "Ceramic coating and paint protection film application",
      price: 2999,
      duration: "4-6 hours",
      category: "paint-protection",
      vehicleTypes: ['car'],
      features: ["Paint correction", "Ceramic coating", "UV protection", "1 year warranty"],
      image: "https://images.unsplash.com/photo-1632823469901-5d2cfff5ba50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      name: "Bike Wash & Polish",
      description: "Specialized bike cleaning with chain maintenance",
      price: 199,
      duration: "45-60 mins",
      category: "bike-specific",
      vehicleTypes: ['bike'],
      features: ["Bike wash", "Chain cleaning", "Polish & wax", "Seat cleaning"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      name: "Express Wash",
      description: "Quick exterior wash for busy schedules",
      price: 199,
      duration: "15-20 mins",
      category: "express",
      vehicleTypes: ['car', 'bike'],
      features: ["Quick exterior wash", "Tire shine", "Basic vacuum"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const handleServiceSelect = (service) => {
    setErrors({});
    
    if (selectedService && selectedService.some(s => s.id === service.id)) {
      // Remove service if already selected
      setSelectedService(prev => prev.filter(s => s.id !== service.id));
    } else {
      // Add service
      setSelectedService(prev => [...(prev || []), service]);
    }
  };

  const calculateTotal = () => {
    if (!selectedService || selectedService.length === 0) return 0;
    return selectedService.reduce((sum, service) => sum + service.price, 0);
  };

  const getVehicleTypeIcon = (vehicleType) => {
    switch(vehicleType) {
      case 'car': return faCar;
      case 'bike': return faMotorcycle;
      case 'truck': return faTruck;
      default: return faCar;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Select Washing Services</h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Choose the washing and detailing services you need</p>
      </div>

      {/* Washing Center Info */}
      {washingCenterInfo && (
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <div className="flex items-center space-x-4">
            <img
              src={washingCenterInfo.image}
              alt={washingCenterInfo.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{washingCenterInfo.name}</h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>{washingCenterInfo.location}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`w-4 h-4 ${
                        i < Math.floor(washingCenterInfo.rating) 
                          ? 'text-yellow-400' 
                          : theme === 'light' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>({washingCenterInfo.rating})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWashingServices.map((service) => {
          const isSelected = selectedService && selectedService.some(s => s.id === service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`rounded-xl p-6 border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? theme === 'light'
                    ? 'border-red-500 bg-red-50'
                    : 'border-red-500 bg-red-900 bg-opacity-20'
                  : theme === 'light'
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Service Image */}
              <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1">
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{service.name}</h3>
                  <span className="text-red-600 font-bold text-lg">₹{service.price}</span>
                </div>

                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{service.description}</p>

                <div className={`flex items-center justify-between text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faSprayCan} className="w-4 h-4 mr-1" />
                    {service.duration}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {service.category.replace('-', ' ')}
                  </span>
                </div>

                {/* Vehicle Types */}
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>For:</span>
                  {service.vehicleTypes.map((type, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={getVehicleTypeIcon(type)}
                      className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                    />
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-1">
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 2 && (
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                        +{service.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedService && selectedService.length > 0 && (
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Services</h3>
          <div className="space-y-3">
            {selectedService.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleServiceSelect(service)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                  </button>
                  <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{service.name}</span>
                </div>
                <span className="text-red-600 font-semibold">₹{service.price}</span>
              </div>
            ))}
            <div className={`border-t pt-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Total</span>
                <span className="text-xl font-bold text-red-600">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors.service && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.service}</p>
        </div>
      )}
    </div>
  );
};

export default WashingSelectServiceStep;
