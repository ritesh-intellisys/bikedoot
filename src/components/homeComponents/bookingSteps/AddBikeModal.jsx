import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { fetchBikeBrands, fetchBikeModels } from '../../../services/bookingService';

const AddBikeModal = ({ isOpen, onClose, onSuccess }) => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [year, setYear] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Generate years from 2010 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);
  
  // Load brands on component mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await fetchBikeBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    };
    
    if (isOpen) {
      loadBrands();
    }
  }, [isOpen]);
  
  // Load models when brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (selectedBrand) {
        try {
          const brandId = brands.find(b => b.name === selectedBrand)?.id;
          if (brandId) {
            const modelsData = await fetchBikeModels(brandId);
            setModels(modelsData);
          }
        } catch (error) {
          console.error('Error loading models:', error);
        }
      } else {
        setModels([]);
      }
      setSelectedModel('');
    };
  }, [selectedBrand, brands]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!selectedBrand) newErrors.brand = 'Please select a brand';
    if (!selectedModel) newErrors.model = 'Please select a model';
    if (!year) newErrors.year = 'Please select a year';
    if (!registrationNumber.trim()) newErrors.registration = 'Please enter registration number';
    if (!color.trim()) newErrors.color = 'Please enter color';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedBrandData = brands.find(b => b.name === selectedBrand);
      const selectedModelData = models.find(m => m.name === selectedModel);
      
      const newVehicle = {
        id: Date.now(),
        vehicle_id: Date.now(),
        brand: selectedBrand,
        model: selectedModel,
        cc_id: selectedModelData?.cc_id || 1,
        cc: selectedModelData?.cc || "110cc",
        year: year,
        registration_number: registrationNumber.toUpperCase(),
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        color: color
      };
      
      onSuccess(newVehicle);
    } catch (error) {
      setErrors({ submit: 'Failed to add bike. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setYear('');
    setRegistrationNumber('');
    setColor('');
    setErrors({});
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Add New Bike</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Brand Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Brand *
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-red-400 text-sm mt-1">{errors.brand}</p>
            )}
          </div>
          
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Model *
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.name}>
                  {model.name} ({model.cc})
                </option>
              ))}
            </select>
            {errors.model && (
              <p className="text-red-400 text-sm mt-1">{errors.model}</p>
            )}
          </div>
          
          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Year *
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="text-red-400 text-sm mt-1">{errors.year}</p>
            )}
          </div>
          
          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Registration Number *
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
              placeholder="e.g., MH01AB1234"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.registration && (
              <p className="text-red-400 text-sm mt-1">{errors.registration}</p>
            )}
          </div>
          
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Color *
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g., Red, Blue, Black"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.color && (
              <p className="text-red-400 text-sm mt-1">{errors.color}</p>
            )}
          </div>
          
          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-600 text-white p-3 rounded-lg">
              <p>{errors.submit}</p>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Bike'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBikeModal;

