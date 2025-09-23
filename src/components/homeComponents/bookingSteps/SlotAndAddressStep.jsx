import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MapPinIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { fetchUserAddresses, createAddress, fetchCities } from '../../../services/bookingService';
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
  const [cities, setCities] = useState([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedEstimateOption, setSelectedEstimateOption] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  // Generate available slots (matching old website logic)
  const generateAvailableSlots = () => {
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const formatDateLabel = (date) => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = days[date.getDay()];
      const formattedDate = date.toISOString().slice(0, 10); // yyyy-mm-dd
      return `${formattedDate} (${dayName})`;
    };

    const generateSlots = (dayIndex) => {
      const today = new Date();
      const date = addDays(today, dayIndex);
      const slots = [];

      let startHour = 10;
      const endHour = 18;

      if (dayIndex === 0) {
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();
        startHour = currentMinutes > 0 ? currentHour + 1 : currentHour;
        if (startHour < 10) startHour = 10;
        if (startHour > endHour) return []; // No slots for today if past endHour
      }

      for (let hour = startHour; hour <= endHour; hour++) {
        const isPM = hour >= 12;
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const label = `${displayHour.toString().padStart(2, "0")}:00 ${isPM ? "PM" : "AM"}`;
        slots.push({ label });
      }

      return slots;
    };

    // Generate slots for 4 days (today + next 3 days)
    const slotsArray = [0, 1, 2, 3].map((dayIndex) => ({
      dateLabel: formatDateLabel(addDays(new Date(), dayIndex)),
      slots: generateSlots(dayIndex),
    }));

    // If today has no slots, drop it and return next 3 days
    if (slotsArray[0].slots.length === 0) {
      return slotsArray.slice(1, 4); // return days 1, 2, 3 (3 days starting tomorrow)
    }

    // Otherwise return first 3 days including today
    return slotsArray.slice(0, 3);
  };

  // Usage
  const garageData = useMemo(() => {
    return {
      availableSlots: generateAvailableSlots(),
    };
  }, []);

  const filterSlots = (slots) =>
    slots.filter((slot) => {
      const timeString = slot.label.replace(/\s*(AM|PM)/i, "");
      const [hours] = timeString.split(":").map(Number);
      const isPM = /PM/i.test(slot.label);
      const slotHour = isPM && hours !== 12 ? hours + 12 : hours;
      return slotHour >= 10 && slotHour < 19;
    });

  // Auto-select first date and slot on mount
  useEffect(() => {
    if (garageData.availableSlots?.length > 0 && !selectedDateLabel) {
      const firstSlot = garageData.availableSlots[0];
      const filtered = filterSlots(firstSlot.slots || []);

      setSelectedDateLabel(firstSlot.dateLabel);
      setSlotAndAddress((prev) => ({
        ...prev,
        date: firstSlot.dateLabel,
        slot: filtered[0]?.label || "",
      }));
      setSelectedSlot(filtered[0]?.label || "");

      console.log("🔵 Auto-selected first date:", firstSlot.dateLabel);
      if (filtered[0]) {
        console.log("🔵 Auto-selected first slot:", filtered[0].label);
      }
    }
  }, [garageData.availableSlots, selectedDateLabel, setSlotAndAddress]);

  // Load cities from landing page API (like old website)
  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityName = sessionStorage.getItem("selectedCity") || "Pune";
        const citiesData = await fetchCities(cityName);
        console.log("🖼️ Fetched cities data:", citiesData);
        
        if (Array.isArray(citiesData) && citiesData.length > 0) {
          setCities(citiesData);
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("❌ Failed to load cities data:", err);
        setCities([]);
      }
    };

    loadCities();
  }, []);

  // Load user addresses
  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true);
      try {
        const subscriberId = localStorage.getItem("subscriberId") || "1";
        const userAddresses = await fetchUserAddresses(subscriberId);
        console.log("🔍 User addresses loaded:", userAddresses);
        setAddresses(userAddresses);
        
        // Auto-select default address if available
        const defaultAddress = userAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          setHasAddress(true);
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
    if (selectedDateLabel && selectedSlot && selectedAddress) {
      setSlotAndAddress({
        date: selectedDateLabel,
        slot: selectedSlot,
        address: selectedAddress,
        estimate: selectedEstimateOption
      });
      setErrors({});
    } else {
      setSlotAndAddress(null);
    }
  }, [selectedDateLabel, selectedSlot, selectedAddress, selectedEstimateOption, setSlotAndAddress, setErrors]);

  const handleDateClick = (date) => {
    setSelectedDateLabel(date);
    setSlotAndAddress((prev) => ({
      ...prev,
      date,
    }));
    console.log("🟢 Selected Date:", date);
  };

  const handleSlotClick = (slotLabel) => {
    console.log("✅ Selected Slot:", slotLabel);
    setSelectedSlot(slotLabel);
    setSlotAndAddress((prev) => ({
      ...prev,
      slot: slotLabel,
    }));
  };

  const handleEstimateSelection = (value) => {
    setSlotAndAddress((prev) => ({
      ...prev,
      estimate: value,
    }));
    setSelectedEstimateOption(value);
    console.log("Selected Estimate Option:", value);
  };

  const handleAddAddressSuccess = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setHasAddress(true);
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
        <h3 className="text-xl font-semibold text-white flex items-center">
          <CalendarDaysIcon className="w-5 h-5 mr-2" />
          Select Date
        </h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {garageData.availableSlots.map((slotData) => (
            <button
              key={slotData.dateLabel}
              onClick={() => handleDateClick(slotData.dateLabel)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedDateLabel === slotData.dateLabel
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {slotData.dateLabel}
            </button>
          ))}
        </div>
      </div>
      
      {/* Time Slot Selection */}
      {selectedDateLabel && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Select Time Slot
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(() => {
              const selectedDateData = garageData.availableSlots.find(
                slot => slot.dateLabel === selectedDateLabel
              );
              const filteredSlots = selectedDateData ? filterSlots(selectedDateData.slots) : [];
              
              return filteredSlots.map((slot) => (
                <button
                  key={slot.label}
                  onClick={() => handleSlotClick(slot.label)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedSlot === slot.label
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {slot.label}
                </button>
              ));
            })()}
          </div>
        </div>
      )}
      
      {/* Address Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            Select Address
          </h3>
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
              onChange={(e) => handleEstimateSelection(e.target.checked)}
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

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSuccess={handleAddAddressSuccess}
        cities={cities}
      />
    </div>
  );
};

export default SlotAndAddressStep;