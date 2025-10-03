import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FilterSystem = ({ filterData, onApplyFilters, isMobile, onSortChange, onClearAll }) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [brandSearch, setBrandSearch] = useState('');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isServiceCategoryOpen, setIsServiceCategoryOpen] = useState({});
  
  const brandDropdownRef = useRef(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    brands: [],
    distance: 5, // Default to 5km
    services: [],
    sort: 'distance' // Default sort by distance
  });

  // Mock brands data - in production, this would come from API
  const brands = [
    'Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 
    'KTM', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'Harley Davidson',
    'Aprilia', 'Triumph', 'Kawasaki', 'Benelli', 'Jawa', 'Mahindra'
  ];

  // Service categories with services
  const serviceCategories = {
    'Basic Maintenance': [
      'General Service',
      'Engine Oil Change', 
      'Bike Wash',
      'Chain Lubrication'
    ],
    'Mechanical Repairs': [
      'Brake Pad Replacement',
      'Clutch Service',
      'Chain & Sprocket',
      'Engine Repair',
      'Transmission Service'
    ],
    'Tyres & Battery': [
      'Tyre Replacement',
      'Battery Replacement',
      'Tyre Puncture Repair',
      'Wheel Alignment'
    ],
    'Other Services': [
      'Performance Tuning',
      'Roadside Assistance',
      'Insurance Claim',
      'Custom Modifications'
    ]
  };

  // Filtered brands based on search
  const filteredBrands = brands.filter(brand =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Handle brand selection
  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  // Handle distance slider change
  const handleDistanceChange = (distance) => {
    setFilters(prev => ({
      ...prev,
      distance: parseInt(distance)
    }));
  };

  // Handle service selection
  const handleServiceToggle = (service) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setFilters(prev => ({
      ...prev,
      sort: sortValue
    }));
    if (onSortChange) {
      onSortChange(sortValue);
    }
  };

  // Toggle service category
  const toggleServiceCategory = (category) => {
    setIsServiceCategoryOpen(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      brands: [],
      distance: 5,
      services: [],
      sort: 'distance'
    });
    setBrandSearch('');
    onApplyFilters({});
    // Also clear garage type and brand selection if callback provided
    if (onClearAll) {
      onClearAll();
    }
  };

  // Close brand dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setIsBrandDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Brand Selector Component
  const BrandSelector = () => (
    <div className="mb-6">
                  <h3 className="text-base font-semibold text-white mb-3">Brand</h3>
      <div className="relative" ref={brandDropdownRef}>
        <button
          onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-left text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300">
              {filters.brands.length === 0 
                ? 'Select brands...' 
                : `${filters.brands.length} brand${filters.brands.length > 1 ? 's' : ''} selected`
              }
            </span>
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isBrandDropdownOpen && (
          <div className="absolute z-50 w-fit min-w-full top-full left-0 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-3 border-b border-gray-600">
              <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto pt-2">
              {filteredBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-500 rounded focus:ring-red-500 focus:ring-2"
                    style={{ accentColor: '#ff3864' }}
                  />
                  <span className="ml-3 text-gray-300">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Distance Range Slider Component
  const DistanceSlider = () => (
    <div className="mb-6">
                  <h3 className="text-base font-semibold text-white mb-3">
                    Distance: {filters.distance} km
                  </h3>
      <div className="px-2">
        <input
          type="range"
          min="1"
          max="15"
          value={filters.distance}
          onChange={(e) => handleDistanceChange(e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ff3864 0%, #ff3864 ${(filters.distance - 1) / 14 * 100}%, #374151 ${(filters.distance - 1) / 14 * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>1 km</span>
          <span>15 km</span>
        </div>
      </div>
    </div>
  );

  // Services Filter Component
  const ServicesFilter = () => (
    <div className="mb-6">
                  <h3 className="text-base font-semibold text-white mb-3">Services</h3>
      <div className="space-y-3">
        {Object.entries(serviceCategories).map(([category, services]) => (
          <div key={category} className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleServiceCategory(category)}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{category}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isServiceCategoryOpen[category] ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </button>
            
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isServiceCategoryOpen[category] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="px-4 pt-3 pb-3 space-y-2 border-t border-gray-600">
                            {services.map((service) => (
                              <label key={service} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
                                  checked={filters.services.includes(service)}
                                  onChange={() => handleServiceToggle(service)}
                                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-500 rounded focus:ring-red-500 focus:ring-2"
                                  style={{ accentColor: '#ff3864' }}
                                />
                                <span className="ml-3 text-gray-300 text-sm">{service}</span>
          </label>
                            ))}
                          </div>
                        </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-xl mb-6">
      <div className={`flex items-center justify-between ${isMobile && !isExpanded ? 'p-4' : 'p-6'} ${isMobile && !isExpanded ? 'w-fit' : ''}`}>
                    <h2 className="text-lg font-bold text-white">Filters</h2>
        {isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors ml-2"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {(!isMobile || isExpanded) && (
        <div className="space-y-6 p-6 pt-0">
          <BrandSelector />
          <DistanceSlider />
          <ServicesFilter />

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleApplyFilters}
                              className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sort By Dropdown Component (to be used in garage listing area)
export const SortByDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'distance', label: 'Distance (Nearest First)' },
    { value: 'rating-high', label: 'Rating (High → Low)' },
    { value: 'rating-low', label: 'Rating (Low → High)' },
    { value: 'price-low', label: 'Price (Low → High)' },
    { value: 'price-high', label: 'Price (High → Low)' },
    { value: 'service-time', label: 'Service Time (Fastest First)' }
  ];

  const currentOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0];

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
      >
        <span className="text-sm font-medium">{currentOption.label}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

                  {isOpen && (
                    <div className="absolute z-10 right-0 mt-2 w-fit min-w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                      <div className="py-2 pt-3">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onSortChange(option.value);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                              currentSort === option.value ? 'text-red-400 bg-gray-700' : 'text-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
      )}
    </div>
  );
};

export default FilterSystem;