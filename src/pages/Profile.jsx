import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PencilIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  HomeIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { fetchUserVehicles, fetchUserAddresses, createAddress, deleteUserVehicle, fetchCities } from '../services/bookingService';
import { fetchLandingPageData } from '../services/landingpage';
import AddVehicleModal from '../components/profileComponents/AddVehicleModal';
import AddAddressModal from '../components/profileComponents/AddAddressModal';
import { useTheme } from '../components/context/ThemeContext';

const Profile = ({ setCurrentPage }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    joinDate: ''
  });
  const [editData, setEditData] = useState({});
  
  // Real data from API
  const [vehicles, setVehicles] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Initialize edit data when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditData({ ...userData });
    }
  }, [isEditing, userData]);

  // Load user data from APIs (matching old website implementation)
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const subscriberId = localStorage.getItem('subscriberId');
        const businessId = localStorage.getItem('businessId');
        
        if (!subscriberId) {
          setError('User not authenticated');
          return;
        }

        // Get selected city from sessionStorage (like old website)
        const selectedCity = sessionStorage.getItem('selectedCity') || 'Pune';

        // Load user vehicles and addresses in parallel
        const [vehiclesData, addressesData] = await Promise.all([
          fetchUserVehicles(subscriberId),
          fetchUserAddresses(subscriberId)
        ]);

        // Load cities from landing page API (like old website)
        try {
          const landingPageData = await fetchLandingPageData(selectedCity.toLowerCase());
          if (landingPageData && Array.isArray(landingPageData.cities) && landingPageData.cities.length > 0) {
            setCities(landingPageData.cities);
          } else {
            // Fallback to active-cities API if landing page doesn't have cities
            const citiesData = await fetchCities(selectedCity);
            setCities(citiesData || []);
          }
        } catch (cityError) {
          console.error('Error loading cities:', cityError);
          // Try fallback API
          try {
            const citiesData = await fetchCities(selectedCity);
            setCities(citiesData || []);
          } catch (fallbackError) {
            console.error('Fallback cities API also failed:', fallbackError);
            setCities([]);
          }
        }

        // Set user profile data with basic info from localStorage (like old website)
        const mobileNumber = localStorage.getItem('mobileNumber') || '';
        setUserData({
          name: 'User',
          email: '',
          phone: mobileNumber,
          city: selectedCity,
          joinDate: 'Recently'
        });

        setVehicles(vehiclesData || []);
        setAddresses(addressesData || []);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const subscriberId = localStorage.getItem('subscriberId');
      const businessId = localStorage.getItem('businessId');
      
      if (!subscriberId || !businessId) {
        setError('User not authenticated');
        return;
      }

      const payload = {
        businessid: parseInt(businessId),
        subscriberid: parseInt(subscriberId),
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        city: editData.city
      };

      // Since profile update API doesn't exist in old website, just update local state
      setUserData({ ...editData });
      setIsEditing(false);
      setError('');
      // Store mobile number in localStorage for future reference
      if (editData.phone) {
        localStorage.setItem('mobileNumber', editData.phone);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const subscriberId = localStorage.getItem('subscriberId');
      const businessId = localStorage.getItem('businessId');
      
      if (!subscriberId || !businessId) {
        setError('User not authenticated');
        return;
      }

      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return;

      const payload = {
        businessid: parseInt(businessId),
        subscriberid: parseInt(subscriberId),
        model: vehicle.model?.id || vehicle.model_id,
        vehicleid: vehicleId
      };

      const response = await deleteUserVehicle(payload);
      
      if (response.success !== false) {
        // Refresh vehicles list from API (like old website)
        try {
          const vehiclesData = await fetchUserVehicles(subscriberId);
          setVehicles(vehiclesData || []);
        } catch (refreshError) {
          console.error('Error refreshing vehicles after delete:', refreshError);
          // Fallback to local update
          setVehicles(prev => prev.filter(v => v.id !== vehicleId));
        }
        setError('');
      } else {
        setError(response.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('Failed to delete vehicle');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      // Note: The old website doesn't have delete address functionality
      // This would need to be implemented in the backend
      setAddresses(prev => prev.filter(address => address.id !== addressId));
      setError('');
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // Since booking cancellation API doesn't exist in old website, just update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Cancelled' }
          : booking
      ));
      setError('');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking');
    }
  };

  const handleAddVehicleSuccess = async (newVehicle) => {
    // Refresh vehicles list from API (like old website)
    try {
      const subscriberId = localStorage.getItem('subscriberId');
      if (subscriberId) {
        const vehiclesData = await fetchUserVehicles(subscriberId);
        setVehicles(vehiclesData || []);
      } else {
        // Fallback to local update if API fails
        setVehicles(prev => [...prev, newVehicle]);
      }
    } catch (error) {
      console.error('Error refreshing vehicles:', error);
      // Fallback to local update
      setVehicles(prev => [...prev, newVehicle]);
    }
    setIsAddVehicleModalOpen(false);
    setError('');
  };

  const handleAddAddressSuccess = async (newAddress) => {
    // Refresh addresses list from API (like old website)
    try {
      const subscriberId = localStorage.getItem('subscriberId');
      if (subscriberId) {
        const addressesData = await fetchUserAddresses(subscriberId);
        setAddresses(addressesData || []);
      } else {
        // Fallback to local update if API fails
        setAddresses(prev => [...prev, newAddress]);
      }
    } catch (error) {
      console.error('Error refreshing addresses:', error);
      // Fallback to local update
      setAddresses(prev => [...prev, newAddress]);
    }
    setIsAddAddressModalOpen(false);
    setError('');
  };


  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
      {/* Header */}
      <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-800'} border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>My Profile</h1>
                <p className={`mt-1 text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-800'} border-b`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-2 sm:space-x-8">
            {[
              { id: 'profile', label: 'My Profile', icon: UserIcon, shortLabel: 'Profile' },
              { id: 'vehicles', label: 'My Vehicles', icon: TruckIcon, shortLabel: 'Vehicles' },
              { id: 'addresses', label: 'My Addresses', icon: HomeIcon, shortLabel: 'Addresses' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-500'
                    : theme === 'light' 
                      ? 'border-transparent text-gray-600 hover:text-gray-900' 
                      : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading your data...</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* My Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4 sm:space-y-6">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} rounded-lg p-4 sm:p-6 border`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div>
                  <label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1 ${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-800 text-white border-gray-700'}`}
                    />
                  ) : (
                    <p className={`mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{userData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1 ${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-800 text-white border-gray-700'}`}
                    />
                  ) : (
                    <p className={`mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{userData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1 ${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-800 text-white border-gray-700'}`}
                    />
                  ) : (
                    <p className={`mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{userData.phone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>City</label>
                  {isEditing ? (
                    <select
                      value={editData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1 ${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-800 text-white border-gray-700'}`}
                    >
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  ) : (
                    <p className={`mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{userData.city}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4 sm:space-y-6">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} rounded-lg p-4 sm:p-6 border`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>My Vehicles</h3>
                <button 
                  onClick={() => setIsAddVehicleModalOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-lg p-4 border relative group`}>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    
                    <div className={`w-full h-32 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} rounded-lg mb-4 flex items-center justify-center`}>
                      <TruckIcon className={`w-12 h-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    
                    <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{vehicle.model?.name || vehicle.name || 'Unknown Vehicle'}</h4>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Model: {vehicle.model?.name || vehicle.model || 'N/A'}</p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Year: {vehicle.year || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4 sm:space-y-6">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} rounded-lg p-4 sm:p-6 border`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>My Addresses</h3>
                <button 
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {addresses.map(address => (
                  <div key={address.id} className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-lg p-4 border relative group`}>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-start space-x-3">
                      <HomeIcon className="w-6 h-6 text-red-500 mt-1" />
                      <div className="flex-1">
                        <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {cities.find(city => city.id === address.city_id)?.name || address.city || 'Unknown City'}
                        </h4>
                        <p className={`text-sm mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Pincode: {address.pincode}</p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{address.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onSuccess={handleAddVehicleSuccess}
      />

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSuccess={handleAddAddressSuccess}
      />
    </div>
  );
};

export default Profile;
