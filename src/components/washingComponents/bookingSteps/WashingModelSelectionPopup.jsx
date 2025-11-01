import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const WashingModelSelectionPopup = ({ isOpen, onClose, onModelSelect, selectedBrand }) => {
  const { theme } = useTheme();
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Demo models data for washing service
  const getDemoModels = (brandId) => {
    const modelsByBrand = {
      1: [ // Honda
        { id: 1, name: 'Activa 6G', cc: '110cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 2, name: 'Shine', cc: '125cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 3, name: 'Unicorn', cc: '160cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 4, name: 'CBR 150R', cc: '150cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' }
      ],
      2: [ // Bajaj
        { id: 5, name: 'Pulsar 150', cc: '150cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 6, name: 'Pulsar 220', cc: '220cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 7, name: 'Dominar 400', cc: '400cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 8, name: 'Avenger', cc: '220cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' }
      ],
      3: [ // TVS
        { id: 9, name: 'Apache RTR 160', cc: '160cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 10, name: 'Apache RTR 200', cc: '200cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 11, name: 'Jupiter', cc: '110cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 12, name: 'Ntorq', cc: '125cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' }
      ],
      4: [ // Hero
        { id: 13, name: 'Splendor Plus', cc: '100cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 14, name: 'Passion Pro', cc: '110cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 15, name: 'Xpulse 200', cc: '200cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 16, name: 'Karizma', cc: '223cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' }
      ],
      5: [ // Yamaha
        { id: 17, name: 'FZ-S', cc: '149cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 18, name: 'R15 V4', cc: '155cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 19, name: 'MT-15', cc: '155cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 20, name: 'Ray ZR', cc: '125cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' }
      ],
      6: [ // Royal Enfield
        { id: 21, name: 'Classic 350', cc: '350cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 22, name: 'Bullet 350', cc: '350cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 23, name: 'Himalayan', cc: '411cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
        { id: 24, name: 'Meteor 350', cc: '350cc', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' }
      ]
    };
    
    return modelsByBrand[brandId] || [];
  };

  // Load models when popup opens and brand is selected
  useEffect(() => {
    const loadModels = async () => {
      if (isOpen && selectedBrand) {
        setLoading(true);
        try {
          console.log('🔍 Loading demo bike models for washing service:', selectedBrand);
          const modelsData = getDemoModels(selectedBrand.id);
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
    console.log('🔍 Model selected for washing:', model);
    
    setSaving(true);
    
    try {
      // Create bike data for washing booking (demo version)
      const bikeData = {
        id: model.id,
        vehicle_id: model.id,
        name: model.name,
        image: model.image || "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
        cc_id: 1,
        cc: model.cc || "110cc",
        brand: selectedBrand.name,
        model: model.name,
        year: new Date().getFullYear(),
        registration_number: `WASH-${Date.now()}`,
        modelData: model,
        brandData: selectedBrand
      };
      
      console.log('✅ Demo bike created for washing:', bikeData);
      onModelSelect(bikeData);
    } catch (error) {
      console.error('❌ Error creating demo bike:', error);
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
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b gap-4 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
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
            <div className="relative flex-1 sm:flex-none">
              <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64 ${
                  theme === 'light'
                    ? 'bg-white text-gray-900 border-gray-300'
                    : 'bg-gray-700 text-white border-gray-600'
                }`}
              />
            </div>
            <button
              onClick={handleClose}
              className={`transition-colors flex-shrink-0 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
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
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Loading models...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => !saving && handleModelClick(model)}
                  className={`rounded-xl p-4 transition-all duration-200 border flex flex-col items-center justify-center min-h-[160px] ${
                    saving 
                      ? 'cursor-not-allowed opacity-50' 
                      : theme === 'light'
                      ? 'bg-white border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-gray-300 hover:scale-105 hover:shadow-lg'
                      : 'bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 hover:scale-105 hover:shadow-lg'
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

export default WashingModelSelectionPopup;