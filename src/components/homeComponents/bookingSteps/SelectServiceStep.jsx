import React, { useState, useEffect } from 'react';
import { fetchGarageServices } from '../../../services/bookingService';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [addOns, setAddOns] = useState([]);
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
          ccid: bikeData.cc_id || bikeData.model?.cc_id || bikeData.cc || 1
        };
        
        const serviceData = await fetchGarageServices(payload);
        console.log('🔍 Complete service data structure:', serviceData);
        
        // If no services found, try with different ccid values
        if (serviceData.services.length === 0 && serviceData.addOns.length === 0) {
          console.log('🔍 No services found, trying with different ccid values...');
          
          // Try with ccid 2, 3, 4, 5 (common ccid values)
          for (let testCcid of [2, 3, 4, 5]) {
            const testPayload = { garageid: garageId, ccid: testCcid };
            console.log(`🔍 Trying ccid ${testCcid}:`, testPayload);
            
            try {
              const testServiceData = await fetchGarageServices(testPayload);
              console.log(`🔍 Test result for ccid ${testCcid}:`, testServiceData);
              
              if (testServiceData.services.length > 0 || testServiceData.addOns.length > 0) {
                console.log(`🔍 Found services with ccid ${testCcid}!`);
                setServices(testServiceData.services);
                setAddOns(testServiceData.addOns);
                return;
              }
            } catch (testError) {
              console.log(`🔍 Test failed for ccid ${testCcid}:`, testError.message);
            }
          }
        }
        
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
    const serviceTotal = selectedServices.reduce((sum, service) => sum + parseFloat(service.price || 0), 0);
    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + parseFloat(addOn.price || 0), 0);
    return serviceTotal + addOnTotal;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-400'}>Loading services...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Select Services</h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Choose the services you need for your {bikeData?.brand || bikeData?.model?.name || 'vehicle'}</p>
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
        <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Services</h3>
        <div className="space-y-3">
          {(services || []).map((service) => {
            console.log('🔍 Rendering service:', service.name, 'Full object:', service);
            return (
            <div
              key={service.id}
              className={`rounded-xl border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {service.name}
                  </h4>
                  <button
                    onClick={() => toggleService(service)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isServiceSelected(service)
                        ? 'bg-red-600 text-white'
                        : theme === 'light'
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {isServiceSelected(service) ? 'Remove' : 'Add'}
                  </button>
                </div>
                
                <div className={`flex items-center space-x-4 text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
                  <span>Duration: {service.duration}</span>
                  <span>•</span>
                  <span className="text-red-400 font-semibold">
                    ₹{parseFloat(service.price || 0).toFixed(0)}
                  </span>
                </div>
                
                {/* Service Details - Always Visible */}
                  <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                    <h5 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Includes:</h5>
                  {console.log('🔍 Service details for:', service.name, 'Includes:', service.includes)}
                  <ul className="space-y-2">
                    {(() => {
                      // Handle multiple possible field names and formats
                      let includesList = [];
                      const includesData = service.includes || service.details || service.description || service.features || '';
                      console.log('🔍 Service includes data:', includesData, 'Type:', typeof includesData);
                      console.log('🔍 Service object keys:', Object.keys(service));
                      
                      if (Array.isArray(includesData)) {
                        includesList = includesData;
                      } else if (typeof includesData === 'string' && includesData.trim()) {
                        // Split by multiple bullet point formats and clean up
                        includesList = includesData
                          .split(/[•·\-\*]/) // Split by bullet, middle dot, dash, or asterisk
                          .map(item => item.trim())
                          .filter(item => item.length > 0 && item !== '');
                        
                        // If no items found with bullet points, try splitting by newlines
                        if (includesList.length === 0) {
                          includesList = includesData
                            .split('\n')
                            .map(item => item.trim())
                            .filter(item => item.length > 0);
                        }
                        
                        // If still no items, try splitting by periods
                        if (includesList.length === 0) {
                          includesList = includesData
                            .split('.')
                            .map(item => item.trim())
                            .filter(item => item.length > 0);
                        }
                      }
                      
                      console.log('🔍 Processed includes list:', includesList);
                      
                      // If no includes found, show a fallback message
                      if (includesList.length === 0) {
                        return (
                          <li className={`text-sm italic ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Service details not available
                          </li>
                        );
                      }
                      
                      return includesList.map((item, index) => (
                        <li key={index} className={`text-sm flex items-start ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ));
                    })()}
                    </ul>
                  </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      
      {/* Add-ons Section */}
      <div className="space-y-4">
        <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(addOns || []).map((addOn) => (
            <div
              key={addOn.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isAddOnSelected(addOn)
                  ? 'border-red-500'
                  : theme === 'light'
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'border-gray-700 hover:border-gray-600'
              } ${theme === 'light' ? isAddOnSelected(addOn) ? 'bg-gray-50' : 'bg-white' : isAddOnSelected(addOn) ? 'bg-gray-700' : 'bg-gray-800'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {addOn.name}
                </h4>
                <span className="text-red-400 font-semibold">
                  ₹{parseFloat(addOn.price || 0).toFixed(0)}
                </span>
              </div>
              
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {addOn.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Duration: {addOn.duration}
                </span>
                
                <button
                  onClick={() => toggleAddOn(addOn)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isAddOnSelected(addOn)
                      ? 'bg-red-600 text-white'
                      : theme === 'light'
                      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
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
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Services</h3>
          
          {selectedServices.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Services:</h4>
              <div className="space-y-2">
                {(selectedServices || []).map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{service.name}</span>
                    <span className="text-red-400 font-semibold">₹{parseFloat(service.price || 0).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedAddOns.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Add-ons:</h4>
              <div className="space-y-2">
                {(selectedAddOns || []).map((addOn) => (
                  <div key={addOn.id} className="flex justify-between items-center">
                    <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{addOn.name}</span>
                    <span className="text-red-400 font-semibold">₹{parseFloat(addOn.price || 0).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className={`border-t pt-4 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            <div className="flex justify-between items-center">
              <span className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Total:</span>
              <span className="text-xl font-bold text-red-400">₹{calculateTotal().toFixed(0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectServiceStep;

