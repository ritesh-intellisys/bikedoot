import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
// import { fetchUserVehicles } from '../../../services/bookingService';
// import AddBikeModal from '../../homeComponents/bookingSteps/AddBikeModal';

const WashingSelectBikeStep = ({ 
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
  
  // Demo vehicles data - no API calls
  const demoVehicles = [
    {
      id: 1,
      name: 'Honda Activa 6G',
      brand: 'Honda',
      model: 'Activa 6G',
      cc: '110cc',
      image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg',
      year: 2023,
      registration_number: 'MH12AB1234'
    },
    {
      id: 2,
      name: 'Bajaj Pulsar 150',
      brand: 'Bajaj',
      model: 'Pulsar 150',
      cc: '150cc',
      image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg',
      year: 2022,
      registration_number: 'MH12CD5678'
    },
    {
      id: 3,
      name: 'TVS Apache RTR 160',
      brand: 'TVS',
      model: 'Apache RTR 160',
      cc: '160cc',
      image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg',
      year: 2023,
      registration_number: 'MH12EF9012'
    }
  ];

  // Load demo vehicles on component mount
  useEffect(() => {
    setLoading(true);
    try {
      console.log('🔍 Loading demo vehicles for washing service');
      setVehicles(demoVehicles);
      
      // Auto-select first vehicle if none selected
      if (demoVehicles.length > 0 && !bikeData) {
        setSelectedBikeId(demoVehicles[0].id);
        setBikeData(demoVehicles[0]);
      }
    } catch (error) {
      console.error('Error loading demo vehicles:', error);
      setErrors({ vehicles: 'Unable to load vehicles. Please refresh the page and try again.' });
    } finally {
      setLoading(false);
    }
  }, [setBikeData, setLoading, setErrors]);
  
  const handleBikeSelect = (vehicle) => {
    setSelectedBikeId(vehicle.id);
    setBikeData(vehicle);
    setErrors({});
  };
  
  const handleAddBikeSuccess = (newVehicle) => {
    // For washing booking, we'll use demo data and add the vehicle locally
    console.log('🔍 Washing booking - adding demo vehicle:', newVehicle);
    
    // Add the new vehicle to the demo list
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
        <h2 className="text-2xl font-bold text-white mb-2">Select Your Vehicle</h2>
        <p className="text-gray-400">Choose the vehicle you want to wash</p>
      </div>
      
      {/* Error Display */}
      {errors.bike && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.bike}</p>
        </div>
      )}
      
      {/* Vehicles Grid */}
      <div className="grid grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => handleBikeSelect(vehicle)}
            className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
              selectedBikeId === vehicle.id
                ? 'ring-2 ring-red-500 bg-gray-700 scale-105'
                : 'hover:scale-102'
            }`}
          >
            <div className="text-center">
              <img
                src={vehicle.image || vehicle.model?.image || 'https://via.placeholder.com/96'}
                alt={vehicle.brand || vehicle.model?.name || vehicle.name || 'Vehicle'}
                className="w-16 h-16 mx-auto mb-3 object-cover rounded-lg"
              />
              <h3 className="text-sm font-semibold text-white mb-1">
                {vehicle.brand || vehicle.model?.name || vehicle.name || 'Unknown Vehicle'}
              </h3>
              {selectedBikeId === vehicle.id && (
                <div className="mt-2">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                    Selected
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Add New Vehicle Card */}
        <div
          onClick={() => setIsAddBikeModalOpen(true)}
          className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-red-500 hover:bg-gray-700 flex flex-col items-center justify-center min-h-[140px]"
        >
          <PlusIcon className="w-6 h-6 text-gray-400 mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Add New Vehicle</h3>
          <p className="text-gray-400 text-xs text-center">
            Don't see your vehicle? Add it to your profile
          </p>
        </div>
      </div>
      
      {/* Selected Vehicle Summary */}
      {bikeData && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Vehicle</h3>
          <div className="flex items-center space-x-4">
            <img
              src={bikeData.image || bikeData.model?.image || 'https://via.placeholder.com/96'}
              alt={bikeData.brand || bikeData.model?.name || 'Vehicle'}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="text-white font-medium">
                {bikeData.brand || bikeData.model?.name || 'Unknown Vehicle'}
              </h4>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Vehicle Modal - Demo Version */}
      {isAddBikeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Vehicle</h3>
            <p className="text-gray-400 mb-4">This is a demo version. In the real app, you would be able to add your vehicle here.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddBikeModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add a demo vehicle
                  const newVehicle = {
                    id: Date.now(),
                    name: 'Demo Bike',
                    brand: 'Demo Brand',
                    model: 'Demo Model',
                    cc: '150cc',
                    image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg',
                    year: new Date().getFullYear(),
                    registration_number: `DEMO-${Date.now()}`
                  };
                  handleAddBikeSuccess(newVehicle);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add Demo Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WashingSelectBikeStep;
