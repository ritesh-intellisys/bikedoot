import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { fetchUserAddresses } from '../../../services/bookingService';
import AddAddressModal from './AddAddressModal';

const SlotAndAddressStep = ({ 
  slotAndAddress, 
  setSlotAndAddress, 
  loading, 
  setLoading, 
  errors, 
  setErrors 
}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedEstimateOption, setSelectedEstimateOption] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  
  // Generate available dates (next 3 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };
  
  // Generate time slots (9 AM to 6 PM, 1-hour intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time: time,
        display: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      });
    }
    return slots;
  };
  
  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();
  
  // Load user addresses on component mount
  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true);
      try {
        const subscriberId = localStorage.getItem("subscriberId") || "1";
        const userAddresses = await fetchUserAddresses(subscriberId);
        setAddresses(userAddresses);
        
        // Auto-select default address if available
        const defaultAddress = userAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setErrors({ addresses: 'Failed to load addresses. Please try again.' });
      } finally {
        setLoading(false);
      }
    };
    
    loadAddresses();
  }, [setLoading, setErrors]);
  
  // Update parent component when selections change
  useEffect(() => {
    if (selectedDate && selectedSlot && selectedAddress) {
      setSlotAndAddress({
        date: selectedDate,
        slot: selectedSlot,
        address: selectedAddress,
        estimate: selectedEstimateOption
      });
      setErrors({});
    } else {
      setSlotAndAddress(null);
    }
  }, [selectedDate, selectedSlot, selectedAddress, selectedEstimateOption, setSlotAndAddress, setErrors]);
  
  const handleAddAddressSuccess = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setIsAddAddressModalOpen(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading addresses...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select Date, Time & Address</h2>
        <p className="text-gray-400">Choose when and where you want the service</p>
      </div>
      
      {/* Error Display */}
      {errors.slot && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.slot}</p>
        </div>
      )}
      
      {errors.addresses && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.addresses}</p>
        </div>
      )}
      
      {/* Date Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Select Date</h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {availableDates.map((dateObj) => (
            <button
              key={dateObj.date}
              onClick={() => setSelectedDate(dateObj.date)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedDate === dateObj.date
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {dateObj.display}
            </button>
          ))}
        </div>
      </div>
      
      {/* Time Slot Selection */}
      {selectedDate && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Select Time Slot</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedSlot(slot.time)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedSlot === slot.time
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {slot.display}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Address Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Select Address</h3>
          <button
            onClick={() => setIsAddAddressModalOpen(true)}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddress(address)}
              className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
                selectedAddress?.id === address.id
                  ? 'border-red-500 bg-gray-700'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium">{address.address}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {address.city} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className="text-gray-500 text-xs mt-1">
                      Landmark: {address.landmark}
                    </p>
                  )}
                </div>
                
                {address.is_default && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                
                {selectedAddress?.id === address.id && (
                  <div className="ml-3">
                    <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Estimate Option */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Additional Options</h3>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedEstimateOption}
              onChange={(e) => setSelectedEstimateOption(e.target.checked)}
              className="w-5 h-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
            />
            <div>
              <span className="text-white font-medium">Request Estimate</span>
              <p className="text-gray-400 text-sm">
                Get a detailed estimate before starting the service
              </p>
            </div>
          </label>
        </div>
      </div>
      
      {/* Selection Summary */}
      {(selectedDate || selectedSlot || selectedAddress) && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Details</h3>
          
          <div className="space-y-3">
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
            
            {selectedSlot && (
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">
                  {timeSlots.find(s => s.time === selectedSlot)?.display}
                </span>
              </div>
            )}
            
            {selectedAddress && (
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-white text-right max-w-xs">
                  {selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-400">Estimate Requested:</span>
              <span className="text-white">
                {selectedEstimateOption ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <AddAddressModal
          isOpen={isAddAddressModalOpen}
          onClose={() => setIsAddAddressModalOpen(false)}
          onSuccess={handleAddAddressSuccess}
        />
      )}
    </div>
  );
};

export default SlotAndAddressStep;

