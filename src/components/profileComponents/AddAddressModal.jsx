import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createAddress, fetchCities } from '../../services/bookingService';
import { fetchLandingPageData } from '../../services/landingpage';
import { useTheme } from '../context/ThemeContext';

const AddAddressModal = ({ isOpen, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load cities when modal opens (matching old website implementation)
  useEffect(() => {
    if (isOpen) {
      loadCities();
    }
  }, [isOpen]);

  const loadCities = async () => {
    setLoading(true);
    try {
      // Get selected city from sessionStorage (like old website)
      const selectedCity = sessionStorage.getItem('selectedCity') || 'Pune';
      
      // Try landing page API first (like old website)
      try {
        const landingPageData = await fetchLandingPageData(selectedCity.toLowerCase());
        if (landingPageData && Array.isArray(landingPageData.cities) && landingPageData.cities.length > 0) {
          setCities(landingPageData.cities);
        } else {
          // Fallback to active-cities API
          const citiesData = await fetchCities(selectedCity);
          setCities(citiesData || []);
        }
      } catch (landingError) {
        console.error('Error loading cities from landing page:', landingError);
        // Try fallback API
        try {
          const citiesData = await fetchCities(selectedCity);
          setCities(citiesData || []);
        } catch (fallbackError) {
          console.error('Fallback cities API also failed:', fallbackError);
          setError('Failed to load cities');
        }
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      setError('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const subscriberId = localStorage.getItem('subscriberId');
      const businessId = localStorage.getItem('businessId');
      
      if (!subscriberId || !businessId) {
        setError('User not authenticated');
        return;
      }

      // Find city ID from cities list
      const selectedCity = cities.find(city => city.name === formData.city);
      if (!selectedCity) {
        setError('Please select a valid city');
        return;
      }

      const addressPayload = {
        businessid: parseInt(businessId),
        subscriberid: parseInt(subscriberId),
        address: formData.address,
        city: selectedCity.id,
        pincode: formData.pincode,
        landmark: formData.landmark || ''
      };

      const createResponse = await createAddress(addressPayload);
      
      if (createResponse.success !== false) {
        // Address created successfully
        const addressData = {
          id: createResponse.data?.id || Date.now(),
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          landmark: formData.landmark
        };
        
        onSuccess(addressData);
        handleClose();
      } else {
        setError(createResponse.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error creating address:', error);
      setError('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      address: '',
      city: '',
      pincode: '',
      landmark: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Add New Address</h2>
          <button
            onClick={handleClose}
            className={`transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Address */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your full address"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                theme === 'light'
                  ? 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
                  : 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              }`}
              rows={3}
              required
            />
          </div>

          {/* City */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              City *
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                theme === 'light'
                  ? 'bg-white text-gray-900 border-gray-300'
                  : 'bg-gray-700 text-white border-gray-600'
              }`}
              required
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pincode */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Pincode *
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="Enter pincode"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                theme === 'light'
                  ? 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
                  : 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              }`}
              required
            />
          </div>

          {/* Landmark */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              placeholder="Enter landmark"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                theme === 'light'
                  ? 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
                  : 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-600 text-white rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors"
            >
              {loading ? 'Adding...' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
