import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { fetchUserVehicles } from '../../../services/bookingService';
import AddBikeModal from './AddBikeModal';

const SelectBikeStep = ({ 
  bikeData, 
  setBikeData, 
  loading, 
  setLoading, 
  errors, 
  setErrors 
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [isAddBikeModalOpen, setIsAddBikeModalOpen] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  
  // Fetch user vehicles on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        const subscriberId = localStorage.getItem("subscriberId") || "1";
        const userVehicles = await fetchUserVehicles(subscriberId);
        console.log('🔍 User vehicles data structure:', userVehicles);
        if (userVehicles.length > 0) {
          console.log('🔍 First vehicle structure:', userVehicles[0]);
          console.log('🔍 Vehicle properties:', Object.keys(userVehicles[0]));
        }
        setVehicles(userVehicles);
        
        // Auto-select first vehicle if none selected
        if (userVehicles.length > 0 && !bikeData) {
          setSelectedBikeId(userVehicles[0].id);
          setBikeData(userVehicles[0]);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setErrors({ vehicles: 'Failed to load vehicles. Please try again.' });
      } finally {
        setLoading(false);
      }
    };
    
    loadVehicles();
  }, [setBikeData, setLoading, setErrors]);
  
  const handleBikeSelect = (vehicle) => {
    setSelectedBikeId(vehicle.id);
    setBikeData(vehicle);
    setErrors({});
  };
  
  const handleAddBikeSuccess = (newVehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
    setSelectedBikeId(newVehicle.id);
    setBikeData(newVehicle);
    setIsAddBikeModalOpen(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your vehicles...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select Your Bike</h2>
        <p className="text-gray-400">Choose the bike you want to service</p>
      </div>
      
      {/* Error Display */}
      {errors.bike && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.bike}</p>
        </div>
      )}
      
      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => handleBikeSelect(vehicle)}
            className={`bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
              selectedBikeId === vehicle.id
                ? 'ring-2 ring-red-500 bg-gray-700 scale-105'
                : 'hover:scale-102'
            }`}
          >
            <div className="text-center">
              <img
                src={vehicle.image || vehicle.model?.image || 'https://via.placeholder.com/96'}
                alt={vehicle.brand || vehicle.model?.name || vehicle.name || 'Vehicle'}
                className="w-24 h-24 mx-auto mb-4 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold text-white mb-1">
                {vehicle.brand || vehicle.model?.name || vehicle.name || 'Unknown Vehicle'}
              </h3>
              <p className="text-gray-400 text-sm mb-2">{vehicle.cc || vehicle.model?.cc || 'N/A'}</p>
              <p className="text-gray-500 text-xs">{vehicle.year || 'N/A'}</p>
              <p className="text-gray-500 text-xs">{vehicle.registration_number || 'N/A'}</p>
              {selectedBikeId === vehicle.id && (
                <div className="mt-3">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                    Selected
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Add New Bike Card */}
        <div
          onClick={() => setIsAddBikeModalOpen(true)}
          className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-red-500 hover:bg-gray-700 flex flex-col items-center justify-center min-h-[200px]"
        >
          <PlusIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Add New Bike</h3>
          <p className="text-gray-400 text-sm text-center">
            Don't see your bike? Add it to your profile
          </p>
        </div>
      </div>
      
      {/* Selected Bike Summary */}
      {bikeData && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Bike</h3>
          <div className="flex items-center space-x-4">
            <img
              src={bikeData.image}
              alt={`${bikeData.brand} ${bikeData.model}`}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="text-white font-medium">
                {bikeData.brand} {bikeData.model}
              </h4>
              <p className="text-gray-400 text-sm">{bikeData.cc} • {bikeData.year}</p>
              <p className="text-gray-500 text-xs">{bikeData.registration_number}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Bike Modal */}
      {isAddBikeModalOpen && (
        <AddBikeModal
          isOpen={isAddBikeModalOpen}
          onClose={() => setIsAddBikeModalOpen(false)}
          onSuccess={handleAddBikeSuccess}
        />
      )}
    </div>
  );
};

export default SelectBikeStep;

