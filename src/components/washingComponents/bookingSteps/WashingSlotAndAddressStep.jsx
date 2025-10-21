import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

const WashingSlotAndAddressStep = ({ 
  washingCenterInfo,
  slotAndAddress, 
  setSlotAndAddress, 
  errors, 
  setErrors 
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [estimate, setEstimate] = useState('no');

  // Mock time slots for washing centers
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  // Mock user addresses
  const mockAddresses = [
    {
      id: 1,
      address: "123, ABC Complex, Koregaon Park",
      city: "Pune",
      pincode: "411001",
      landmark: "Near ABC Mall",
      type: "Home"
    },
    {
      id: 2,
      address: "456, Tech Park, Hinjewadi",
      city: "Pune", 
      pincode: "411057",
      landmark: "Near Tech Hub",
      type: "Office"
    },
    {
      id: 3,
      address: "789, Business Hub, Baner",
      city: "Pune",
      pincode: "411045",
      landmark: "Near Business Center",
      type: "Home"
    }
  ];

  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  // Update slotAndAddress when selections change
  useEffect(() => {
    if (selectedDate && selectedTime && selectedAddress) {
      setSlotAndAddress({
        date: selectedDate,
        slot: selectedTime,
        address: selectedAddress,
        estimate: estimate
      });
    }
  }, [selectedDate, selectedTime, selectedAddress, estimate, setSlotAndAddress]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setErrors(prev => ({ ...prev, date: null }));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setErrors(prev => ({ ...prev, time: null }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    setErrors(prev => ({ ...prev, address: null }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select Date, Time & Address</h2>
        <p className="text-gray-400">Choose when and where you want the washing service</p>
      </div>

      {/* Washing Center Info */}
      {washingCenterInfo && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={washingCenterInfo.image}
              alt={washingCenterInfo.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{washingCenterInfo.name}</h3>
              <p className="text-gray-400">{washingCenterInfo.location}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                <span className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {washingCenterInfo.operatingHours}
                </span>
                <span className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {washingCenterInfo.distance}km away
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Select Date
          </h3>
          <div className="space-y-3">
            {getAvailableDates().map((date) => (
              <button
                key={date.value}
                onClick={() => handleDateSelect(date.value)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedDate === date.value
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {date.label}
              </button>
            ))}
          </div>
          {errors.date && (
            <p className="text-red-400 text-sm mt-2">{errors.date}</p>
          )}
        </div>

        {/* Time Selection */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Select Time
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  selectedTime === time
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.time && (
            <p className="text-red-400 text-sm mt-2">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Address Selection */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            Select Address
          </h3>
          <button
            onClick={() => setShowAddressModal(true)}
            className="text-red-500 hover:text-red-400 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-1" />
            Add New
          </button>
        </div>

        <div className="space-y-3">
          {mockAddresses.map((address) => (
            <button
              key={address.id}
              onClick={() => handleAddressSelect(address)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAddress?.id === address.id
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{address.address}</span>
                    <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                      {address.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {address.city} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className="text-xs text-gray-500">Near {address.landmark}</p>
                  )}
                </div>
                {selectedAddress?.id === address.id && (
                  <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>
        {errors.address && (
          <p className="text-red-400 text-sm mt-2">{errors.address}</p>
        )}
      </div>

      {/* Estimate Requirement */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Options</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Do you need a cost estimate before service?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="estimate"
                  value="yes"
                  checked={estimate === 'yes'}
                  onChange={(e) => setEstimate(e.target.value)}
                  className="mr-2"
                />
                <span className="text-white">Yes, I need an estimate</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="estimate"
                  value="no"
                  checked={estimate === 'no'}
                  onChange={(e) => setEstimate(e.target.value)}
                  className="mr-2"
                />
                <span className="text-white">No, proceed directly</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {(selectedDate || selectedTime || selectedAddress) && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Details</h3>
          <div className="space-y-2">
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">{formatDate(selectedDate)}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">{formatTime(selectedTime)}</span>
              </div>
            )}
            {selectedAddress && (
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-white">{selectedAddress.address}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Estimate Required:</span>
              <span className="text-white">{estimate === 'yes' ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Landmark (Optional)</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Near landmark"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Mock add address functionality
                  alert('Address added successfully! (This is a demo)');
                  setShowAddressModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WashingSlotAndAddressStep;
