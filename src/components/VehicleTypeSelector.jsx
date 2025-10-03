import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const VehicleTypeSelector = ({ currentVehicleType, onVehicleTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const vehicleTypes = [
    { value: 'two-wheeler', label: 'Two Wheeler', icon: '🏍️' },
    { value: 'four-wheeler', label: 'Four Wheeler', icon: '🚗' }
  ];

  const currentType = vehicleTypes.find(type => type.value === currentVehicleType);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVehicleTypeSelect = (vehicleType) => {
    onVehicleTypeChange(vehicleType);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
      >
        <span className="text-lg">{currentType?.icon}</span>
        <span className="text-sm font-medium">{currentType?.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg pt-3">
          {vehicleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleVehicleTypeSelect(type.value)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                currentVehicleType === type.value ? 'text-red-400 bg-gray-700' : 'text-gray-300'
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleTypeSelector;
