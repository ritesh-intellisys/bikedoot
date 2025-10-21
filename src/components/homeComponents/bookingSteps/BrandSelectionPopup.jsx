import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchBikeBrands } from '../../../services/bookingService';

const BrandSelectionPopup = ({ isOpen, onClose, onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom sorting function to prioritize popular brands
  const sortBrandsByPopularity = (brands) => {
    const popularBrands = [
      'Honda', 'Bajaj', 'TVS', 'Hero', 'Yamaha', 'Royal Enfield', 'KTM', 'Suzuki',
      'Kawasaki', 'Ducati', 'BMW', 'Harley-Davidson', 'Aprilia', 'Triumph', 'Benelli'
    ];
    
    return brands.sort((a, b) => {
      const aIndex = popularBrands.findIndex(brand => 
        brand.toLowerCase() === a.name.toLowerCase()
      );
      const bIndex = popularBrands.findIndex(brand => 
        brand.toLowerCase() === b.name.toLowerCase()
      );
      
      // If both brands are in the popular list, sort by their position in the list
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is popular, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // If neither is popular, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  // Load brands when popup opens
  useEffect(() => {
    const loadBrands = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          console.log('🔍 Loading bike brands for popup...');
          const brandsData = await fetchBikeBrands();
          console.log('🔍 Brands data received:', brandsData);
          
          // Sort brands by popularity
          const sortedBrands = sortBrandsByPopularity(brandsData);
          console.log('🔍 Brands sorted by popularity:', sortedBrands);
          
          setBrands(sortedBrands);
          setFilteredBrands(sortedBrands);
        } catch (error) {
          console.error('Error loading brands:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadBrands();
  }, [isOpen]);

  // Filter brands based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Maintain sorting even when filtering
      const sortedFiltered = sortBrandsByPopularity(filtered);
      setFilteredBrands(sortedFiltered);
    }
  }, [searchQuery, brands]);

  const handleBrandClick = (brand) => {
    console.log('🔍 Brand selected:', brand);
    onBrandSelect(brand);
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Select Bike Brand</h2>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
              />
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-400">Loading brands...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => handleBrandClick(brand)}
                  className="bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[140px]"
                >
                  {/* Brand Image */}
                  <div className="w-16 h-16 mb-3 flex items-center justify-center">
                    <img
                      src={brand.image || `https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg`}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg';
                      }}
                    />
                  </div>
                  
                  {/* Brand Name */}
                  <p className="text-white text-sm font-medium text-center">
                    {brand.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredBrands.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400">No brands found matching "{searchQuery}"</p>
            </div>
          )}

          {!loading && filteredBrands.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400">No brands available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandSelectionPopup;
