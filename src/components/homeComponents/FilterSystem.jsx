import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FilterSystem = ({ filterData, onApplyFilters, isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [filters, setFilters] = useState({
    distance: [],
    ratings: [],
    services: [],
    sort: []
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      distance: [],
      ratings: [],
      services: [],
      sort: []
    });
    onApplyFilters({});
  };

  const FilterSection = ({ title, options, filterType }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div className="space-y-2">
        {options?.map((option) => (
          <label key={option.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters[filterType].includes(option.value)}
              onChange={() => handleFilterChange(filterType, option.value)}
                              className="w-4 h-4 text-pink-700 bg-gray-700 border-gray-600 rounded focus:ring-pink-600 focus:ring-2"
            />
            <span className="ml-2 text-gray-300">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        {isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
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
        <>
          <FilterSection title="Distance" options={filterData.distance} filterType="distance" />
          <FilterSection title="Rating" options={filterData.ratings} filterType="ratings" />
          <FilterSection title="Services" options={filterData.services} filterType="services" />
          <FilterSection title="Sort By" options={filterData.sort} filterType="sort" />

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApplyFilters}
                              className="flex-1 bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
        </>
      )}
    </div>
  );
};

export default FilterSystem;
