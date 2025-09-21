import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchBikeModels } from '../../../services/bookingService';

const ModelSelectionPopup = ({ isOpen, onClose, onModelSelect, selectedBrand }) => {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    // Create bike data immediately when model is selected (like old website)
    const bikeData = {
      id: model.id,
      vehicle_id: Date.now(), // Generate temporary ID
      name: model.name,
      image: model.image || "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
      cc_id: model.cc_id || 1,
      cc: model.cc || "110cc",
      brand: selectedBrand.name,
      model: model.name,
      modelData: model,
      brandData: selectedBrand
    };
    
    console.log('🔍 Created bike data:', bikeData);
    onModelSelect(bikeData);
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Select Bike Model</h2>
            {selectedBrand && (
              <p className="text-gray-400 text-sm mt-1">
                {selectedBrand.name} Models
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
              />
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
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
              <p className="text-gray-400">Loading models...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleModelClick(model)}
                  className="bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[160px]"
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
                  <p className="text-white text-sm font-medium text-center mb-1">
                    {model.name}
                  </p>
                  
                  {/* CC Info */}
                  <p className="text-gray-400 text-xs text-center">
                    {model.cc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredModels.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400">No models found matching "{searchQuery}"</p>
            </div>
          )}

          {!loading && filteredModels.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400">No models available for {selectedBrand?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionPopup;
