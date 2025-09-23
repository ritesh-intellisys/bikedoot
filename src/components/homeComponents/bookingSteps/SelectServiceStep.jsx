import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { fetchGarageServices } from '../../../services/bookingService';

const SelectServiceStep = ({ 
  bikeData, 
  selectedService, 
  setSelectedService, 
  garageId,
  loading, 
  setLoading, 
  errors, 
  setErrors 
}) => {
  const [services, setServices] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [expandedService, setExpandedService] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  
  // Load services when bike data is available
  useEffect(() => {
    const loadServices = async () => {
      if (!bikeData || !garageId) return;
      
      setLoading(true);
      try {
        const payload = {
          garageid: garageId,
          ccid: bikeData.cc_id || 1
        };
        
        const serviceData = await fetchGarageServices(payload);
        setServices(serviceData.services);
        setAddOns(serviceData.addOns);
      } catch (error) {
        console.error('Error loading services:', error);
        setErrors({ services: 'Failed to load services. Please try again.' });
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, [bikeData, garageId, setLoading, setErrors]);
  
  // Update parent component when selections change
  useEffect(() => {
    const totalServices = [...selectedServices, ...selectedAddOns];
    setSelectedService(totalServices.length > 0 ? totalServices : null);
    setErrors({});
  }, [selectedServices, selectedAddOns, setSelectedService, setErrors]);
  
  const toggleService = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };
  
  const toggleAddOn = (addOn) => {
    setSelectedAddOns(prev => {
      const isSelected = prev.find(a => a.id === addOn.id);
      if (isSelected) {
        return prev.filter(a => a.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };
  
  const isServiceSelected = (service) => {
    return selectedServices.find(s => s.id === service.id);
  };
  
  const isAddOnSelected = (addOn) => {
    return selectedAddOns.find(a => a.id === addOn.id);
  };
  
  const calculateTotal = () => {
    const serviceTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return serviceTotal + addOnTotal;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select Services</h2>
        <p className="text-gray-400">Choose the services you need for your {bikeData?.brand} {bikeData?.model}</p>
      </div>
      
      {/* Error Display */}
      {errors.service && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.service}</p>
        </div>
      )}
      
      {errors.services && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.services}</p>
        </div>
      )}
      
      {/* Services Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Services</h3>
        <div className="space-y-3">
          {(services || []).map((service) => (
            <div
              key={service.id}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {service.name}
                    </h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Duration: {service.duration}</span>
                      <span>•</span>
                      <span className="text-red-400 font-semibold">
                        ₹{service.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setExpandedService(
                        expandedService === service.id ? null : service.id
                      )}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {expandedService === service.id ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => toggleService(service)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isServiceSelected(service)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {isServiceSelected(service) ? 'Remove' : 'Add'}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedService === service.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h5 className="text-sm font-medium text-white mb-2">Includes:</h5>
                    <ul className="space-y-1">
                      {(service.includes || []).map((item, index) => (
                        <li key={index} className="text-gray-400 text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add-ons Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(addOns || []).map((addOn) => (
            <div
              key={addOn.id}
              className={`bg-gray-800 rounded-xl border p-4 transition-all duration-200 ${
                isAddOnSelected(addOn)
                  ? 'border-red-500 bg-gray-700'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">
                  {addOn.name}
                </h4>
                <span className="text-red-400 font-semibold">
                  ₹{addOn.price}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">
                {addOn.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  Duration: {addOn.duration}
                </span>
                
                <button
                  onClick={() => toggleAddOn(addOn)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isAddOnSelected(addOn)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isAddOnSelected(addOn) ? 'Remove' : 'Add'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Selected Services Summary */}
      {(selectedServices.length > 0 || selectedAddOns.length > 0) && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Services</h3>
          
          {selectedServices.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Services:</h4>
              <div className="space-y-2">
                {(selectedServices || []).map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <span className="text-white">{service.name}</span>
                    <span className="text-red-400 font-semibold">₹{service.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedAddOns.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Add-ons:</h4>
              <div className="space-y-2">
                {(selectedAddOns || []).map((addOn) => (
                  <div key={addOn.id} className="flex justify-between items-center">
                    <span className="text-white">{addOn.name}</span>
                    <span className="text-red-400 font-semibold">₹{addOn.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-xl font-bold text-red-400">₹{calculateTotal()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectServiceStep;

