import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchBikeModels, createUserVehicle } from '../../../services/bookingService';
import { useTheme } from '../../context/ThemeContext';

const ModelSelectionPopup = ({ isOpen, onClose, onModelSelect, selectedBrand }) => {
  const { theme } = useTheme();
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load models when popup opens and brand is selected
  useEffect(() => {
    const loadModels = async () => {
      if (isOpen && selectedBrand) {
        setLoading(true);
        try {
          console.log('🔍 Loading bike models for brand:', selectedBrand);
          const modelsData = await fetchBikeModels(selectedBrand.id);
          console.log('🔍 Models data received:', modelsData);
          setModels(modelsData);
          setFilteredModels(modelsData);
        } catch (error) {
          console.error('Error loading models:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadModels();
  }, [isOpen, selectedBrand]);

  // Filter models based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [searchQuery, models]);

  const handleModelClick = async (model) => {
    console.log('🔍 Model selected:', model);
    
    setSaving(true);
    
    try {
      // Get user authentication data
      const subscriberId = localStorage.getItem('subscriberId');
      const businessId = localStorage.getItem('businessId');
      
      if (!subscriberId || !businessId) {
        console.error('❌ User not authenticated');
        alert('Please log in to add a vehicle to your profile');
        return;
      }

      // Create vehicle in user's profile
      const vehiclePayload = {
        businessid: parseInt(businessId),
        subscriberid: parseInt(subscriberId),
        model: model.id,
        brand: selectedBrand.id,
        cc_id: model.cc_id || 1,
        year: new Date().getFullYear(), // Default to current year
        registration_number: `TEMP-${Date.now()}`, // Temporary registration number
        image: model.image || "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg"
      };

      console.log('🔍 Creating vehicle with payload:', vehiclePayload);
      const createResponse = await createUserVehicle(vehiclePayload);
      
      if (createResponse.success !== false) {
        // Vehicle created successfully, now create bike data for booking
        const bikeData = {
          id: createResponse.data?.id || model.id,
          vehicle_id: createResponse.data?.id || Date.now(),
          name: model.name,
          image: model.image || "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          cc_id: model.cc_id || 1,
          cc: model.cc || "110cc",
          brand: selectedBrand.name,
          model: model.name,
          year: new Date().getFullYear(),
          registration_number: `TEMP-${Date.now()}`,
          modelData: model,
          brandData: selectedBrand
        };
        
        console.log('✅ Vehicle created successfully:', bikeData);
        onModelSelect(bikeData);
      } else {
        console.error('❌ Failed to create vehicle:', createResponse.message);
        alert('Failed to add vehicle to your profile. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error creating vehicle:', error);
      alert('Failed to add vehicle to your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <div>
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Select Bike Model</h2>
            {selectedBrand && (
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {selectedBrand.name} Models
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64 ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                }`}
              />
            </div>
            <button
              onClick={handleClose}
              className={`transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-400'}>Loading models...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => !saving && handleModelClick(model)}
                  className={`rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] border ${
                    saving 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                  } ${
                    theme === 'light'
                      ? 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  {/* Model Image */}
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
                  
                  {/* Model Name */}
                  <p className={`text-sm font-medium text-center mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {model.name}
                  </p>
                  
                  {/* CC Info */}
                  <p className={`text-xs text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {model.cc}
                  </p>
                  
                  {/* Saving indicator */}
                  {saving && (
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mx-auto"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && filteredModels.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>No models found matching "{searchQuery}"</p>
            </div>
          )}

          {!loading && filteredModels.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>No models available for {selectedBrand?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionPopup;
