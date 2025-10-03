import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createAddress, fetchCities } from '../../../services/bookingService';

const AddAddressModal = ({ isOpen, onClose, onSuccess, cities = [] }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!selectedCity) newErrors.city = 'Please select a city';
    if (!address.trim()) newErrors.address = 'Please enter address';
    if (!pincode.trim()) newErrors.pincode = 'Please enter pincode';
    if (pincode.trim().length !== 6) newErrors.pincode = 'Pincode must be 6 digits';
    if (!/^\d+$/.test(pincode.trim())) newErrors.pincode = 'Pincode must contain only numbers';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const subscriberId = localStorage.getItem("subscriberId") || "1";
      const selectedCityData = cities.find(c => c.name === selectedCity);
      
      const businessId = localStorage.getItem("businessId") || "1";
      
      const payload = {
        businessid: parseInt(businessId),
        subscriberid: parseInt(subscriberId),
        city: selectedCityData?.id || 1,
        address: address.trim(),
        pincode: pincode.trim(),
        landmark: landmark.trim() || null
      };
      
      const response = await createAddress(payload);
      
      if (response.success) {
        onSuccess(response.data);
      } else {
        setErrors({ submit: 'Failed to add address. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating address:', error);
      setErrors({ submit: 'Failed to add address. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setSelectedCity('');
    setAddress('');
    setPincode('');
    setLandmark('');
    setErrors({});
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Add New Address</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              City *
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-400 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete address"
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          
          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Pincode *
            </label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.pincode && (
              <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
          
          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Near Metro Station, Opposite Mall"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
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
              {loading ? 'Adding...' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;

