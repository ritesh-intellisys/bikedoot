import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTheme } from './context/ThemeContext';

const VehicleTypeSelector = ({ currentVehicleType, onVehicleTypeChange }) => {
  const { theme } = useTheme();
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
        className={`flex items-center space-x-2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
          theme === 'light'
            ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        <span className="text-lg">{currentType?.icon}</span>
        <span className="text-sm font-medium">{currentType?.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 z-50 mt-2 w-48 border rounded-lg shadow-lg pt-3 ${
          theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
        }`}>
          {vehicleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleVehicleTypeSelect(type.value)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                currentVehicleType === type.value 
                  ? theme === 'light'
                    ? 'text-red-600 bg-gray-100'
                    : 'text-red-400 bg-gray-700'
                  : theme === 'light'
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-300 hover:bg-gray-700'
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
