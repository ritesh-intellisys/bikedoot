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
import { fetchUserVehicles, fetchUserAddresses, createAddress, deleteUserVehicle, fetchUserBookings, cancelBooking, fetchCities, fetchUserProfile, updateUserProfile, initializeUserProfile } from '../services/bookingService';
import AddVehicleModal from '../components/profileComponents/AddVehicleModal';
import AddAddressModal from '../components/profileComponents/AddAddressModal';

const Profile = ({ setCurrentPage }) => {
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
  const [bookings, setBookings] = useState([]);
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

  // Load user data from APIs
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

        // Initialize user profile if it doesn't exist
        const mobileNumber = localStorage.getItem('mobileNumber') || '';
        const initializedProfile = initializeUserProfile(subscriberId, mobileNumber);
        
        // Load user profile, vehicles, addresses, bookings, and cities in parallel
        const [profileData, vehiclesData, addressesData, bookingsData, citiesData] = await Promise.all([
          fetchUserProfile(subscriberId),
          fetchUserVehicles(subscriberId),
          fetchUserAddresses(subscriberId),
          fetchUserBookings(subscriberId),
          fetchCities()
        ]);

        // Set user profile data with fallback to initialized profile
        setUserData({
          name: profileData.name || initializedProfile.name || 'User',
          email: profileData.email || initializedProfile.email || '',
          phone: profileData.phone || profileData.mobile || initializedProfile.phone || mobileNumber,
          city: profileData.city || profileData.location || initializedProfile.city || 'Pune',
          joinDate: profileData.joinDate || profileData.created_at || initializedProfile.createdAt || 'Recently'
        });

        setVehicles(vehiclesData || []);
        setAddresses(addressesData || []);
        setBookings(bookingsData || []);
        setCities(citiesData || []);
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

      const response = await updateUserProfile(payload);
      
      if (response.success !== false) {
        setUserData({ ...editData });
        setIsEditing(false);
        setError('');
        // Store mobile number in localStorage for future reference
        if (editData.phone) {
          localStorage.setItem('mobileNumber', editData.phone);
        }
      } else {
        setError(response.message || 'Failed to update profile');
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
        setVehicles(prev => prev.filter(v => v.id !== vehicleId));
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
      const response = await cancelBooking(bookingId);
      
      if (response.success !== false) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'Cancelled' }
            : booking
        ));
        setError('');
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking');
    }
  };

  const handleAddVehicleSuccess = (newVehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
    setIsAddVehicleModalOpen(false);
    setError('');
  };

  const handleAddAddressSuccess = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    setIsAddAddressModalOpen(false);
    setError('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'text-yellow-500';
      case 'Completed': return 'text-green-500';
      case 'Cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-gray-400 mt-1">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'profile', label: 'My Profile', icon: UserIcon },
              { id: 'vehicles', label: 'My Vehicles', icon: TruckIcon },
              { id: 'addresses', label: 'My Addresses', icon: HomeIcon },
              { id: 'bookings', label: 'My Bookings', icon: CalendarDaysIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* My Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1"
                    />
                  ) : (
                    <p className="text-white mt-1">{userData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1"
                    />
                  ) : (
                    <p className="text-white mt-1">{userData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1"
                    />
                  ) : (
                    <p className="text-white mt-1">{userData.phone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="text-sm text-gray-400">City</label>
                  {isEditing ? (
                    <select
                      value={editData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 w-full mt-1"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  ) : (
                    <p className="text-white mt-1">{userData.city}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
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
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">My Vehicles</h3>
                <button 
                  onClick={() => setIsAddVehicleModalOpen(true)}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 relative group">
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <TruckIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    <h4 className="text-white font-medium mb-2">{vehicle.model?.name || vehicle.name || 'Unknown Vehicle'}</h4>
                    <p className="text-gray-400 text-sm">Model: {vehicle.model?.name || vehicle.model || 'N/A'}</p>
                    <p className="text-gray-400 text-sm">Year: {vehicle.year || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">My Addresses</h3>
                <button 
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                  <div key={address.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 relative group">
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-start space-x-3">
                      <HomeIcon className="w-6 h-6 text-red-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2">
                          {cities.find(city => city.id === address.city_id)?.name || address.city || 'Unknown City'}
                        </h4>
                        <p className="text-gray-400 text-sm mb-1">Pincode: {address.pincode}</p>
                        <p className="text-gray-300 text-sm">{address.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-6">My Bookings</h3>
              
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2">{booking.bike_name || booking.bike || 'Unknown Bike'}</h4>
                        <p className="text-gray-400 text-sm mb-1">Garage: {booking.garage_name || booking.garage || 'Unknown Garage'}</p>
                        <p className="text-gray-400 text-sm mb-1">Date: {booking.booking_date || booking.date} at {booking.booking_slot || booking.time}</p>
                        <p className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                          Status: {booking.status}
                        </p>
                      </div>
                      
                      {booking.status === 'Upcoming' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
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
