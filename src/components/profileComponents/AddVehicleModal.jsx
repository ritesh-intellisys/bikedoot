import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { fetchBikeBrands, fetchBikeModels, createUserVehicle } from '../../services/bookingService';

const AddVehicleModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState('brand'); // 'brand', 'model'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load brands when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBrands();
    }
  }, [isOpen]);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const brandsData = await fetchBikeBrands();
      setBrands(brandsData || []);
    } catch (error) {
      console.error('Error loading brands:', error);
      setError('Failed to load bike brands');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = async (brand) => {
    setSelectedBrand(brand);
    setLoading(true);
    try {
      const modelsData = await fetchBikeModels(brand.id);
      setModels(modelsData || []);
      setCurrentStep('model');
    } catch (error) {
      console.error('Error loading models:', error);
      setError('Failed to load bike models');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = async (model) => {
    setLoading(true);
    setError('');
    
    try {
      const subscriberId = localStorage.getItem('subscriberId');
      const businessId = localStorage.getItem('businessId');
      
      if (!subscriberId || !businessId) {
        setError('User not authenticated');
        return;
      }

      // Create vehicle in user's profile
      const vehiclePayload = {
        businessid: parseInt(businessId),
        subscriberid: parseInt(subscriberId),
        model: model.id,
        brand: selectedBrand.id,
        cc_id: model.cc_id || 1,
        year: new Date().getFullYear(),
        registration_number: `TEMP-${Date.now()}`,
        image: model.image || "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg"
      };

      const createResponse = await createUserVehicle(vehiclePayload);
      
      if (createResponse.success !== false) {
        // Vehicle created successfully
        const vehicleData = {
          id: createResponse.data?.id || model.id,
          name: model.name,
          brand: selectedBrand.name,
          model: model.name,
          cc: model.cc || "110cc",
          year: new Date().getFullYear(),
          image: model.image || "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg"
        };
        
        onSuccess(vehicleData);
        handleClose();
      } else {
        setError(createResponse.message || 'Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setError('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('brand');
    setSelectedBrand(null);
    setModels([]);
    setError('');
    onClose();
  };

  const handleBackToBrands = () => {
    setCurrentStep('brand');
    setSelectedBrand(null);
    setModels([]);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              {currentStep === 'brand' ? 'Select Bike Brand' : 'Select Bike Model'}
            </h2>
            {selectedBrand && (
              <p className="text-gray-400 text-sm mt-1">
                {selectedBrand.name} Models
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-400">
                {currentStep === 'brand' ? 'Loading brands...' : 'Loading models...'}
              </p>
            </div>
          ) : (
            <>
              {currentStep === 'brand' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => handleBrandSelect(brand)}
                      className="bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[120px]"
                    >
                      <div className="w-16 h-16 mb-3 flex items-center justify-center">
                        <img
                          src={brand.image || `https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg`}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg';
                          }}
                        />
                      </div>
                      <p className="text-white text-sm font-medium text-center">
                        {brand.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className="bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[160px]"
                    >
                      <div className="w-20 h-20 mb-3 flex items-center justify-center">
                        <img
                          src={model.image || `https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg`}
                          alt={model.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg';
                          }}
                        />
                      </div>
                      <p className="text-white text-sm font-medium text-center mb-1">
                        {model.name}
                      </p>
                      <p className="text-gray-400 text-xs text-center">
                        {model.cc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {currentStep === 'model' && (
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToBrands}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to brands
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;
