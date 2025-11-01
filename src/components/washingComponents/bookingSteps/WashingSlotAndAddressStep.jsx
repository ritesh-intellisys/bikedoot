import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

const WashingSlotAndAddressStep = ({ 
  washingCenterInfo,
  slotAndAddress, 
  setSlotAndAddress, 
  errors, 
  setErrors 
}) => {
  const { theme } = useTheme();
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
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Select Date, Time & Address</h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Choose when and where you want the washing service</p>
      </div>

      {/* Washing Center Info */}
      {washingCenterInfo && (
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <div className="flex items-center space-x-4">
            <img
              src={washingCenterInfo.image}
              alt={washingCenterInfo.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{washingCenterInfo.name}</h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>{washingCenterInfo.location}</p>
              <div className={`flex items-center space-x-4 mt-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
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
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
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
                    : theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
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
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
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
                    : theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
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
      <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold flex items-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            <MapPinIcon className="w-5 h-5 mr-2" />
            Select Address
          </h3>
          <button
            onClick={() => setShowAddressModal(true)}
            className="text-red-600 hover:text-red-700 flex items-center"
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
                  : theme === 'light'
                  ? 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{address.address}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {address.type}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {address.city} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Near {address.landmark}</p>
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
      <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Additional Options</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
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
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>Yes, I need an estimate</span>
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
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>No, proceed directly</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {(selectedDate || selectedTime || selectedAddress) && (
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Details</h3>
          <div className="space-y-2">
            {selectedDate && (
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Date:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{formatDate(selectedDate)}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Time:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{formatTime(selectedTime)}</span>
              </div>
            )}
            {selectedAddress && (
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Address:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{selectedAddress.address}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Estimate Required:</span>
              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{estimate === 'yes' ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-full max-w-md mx-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Add New Address</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Address</label>
                <input
                  type="text"
                  className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-gray-300'
                      : 'bg-gray-700 text-white border-gray-600'
                  }`}
                  placeholder="Enter your address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>City</label>
                  <input
                    type="text"
                    className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 border-gray-300'
                        : 'bg-gray-700 text-white border-gray-600'
                    }`}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Pincode</label>
                  <input
                    type="text"
                    className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 border-gray-300'
                        : 'bg-gray-700 text-white border-gray-600'
                    }`}
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Landmark (Optional)</label>
                <input
                  type="text"
                  className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-gray-300'
                      : 'bg-gray-700 text-white border-gray-600'
                  }`}
                  placeholder="Near landmark"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Mock add address functionality
                  alert('Address added successfully! (This is a demo)');
                  setShowAddressModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
